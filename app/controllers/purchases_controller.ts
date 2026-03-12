import type { HttpContext } from "@adonisjs/core/http"
import db from "@adonisjs/lucid/services/db"
import Client from "#models/client"
import Product from "#models/product"
import Transaction from "#models/transaction"
import PaymentProcessorService, {
	ProcessResult,
} from "#services/payment_processor_service"
import { createPurchaseValidator } from "#validators/purchase"

export default class PurchasesController {
	/**
	 * @openapi
	 * /v1/purchase:
	 *   post:
	 *     tags:
	 *       - Purchases
	 *     summary: Realizar compra
	 *     description: Cria uma transação, tenta processar o pagamento nos gateways ativos e retorna o resultado final.
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             $ref: '#/components/schemas/CreatePurchaseRequest'
	 *     responses:
	 *       '200':
	 *         description: Pagamento processado com sucesso.
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               required:
	 *                 - message
	 *                 - data
	 *               properties:
	 *                 message:
	 *                   type: string
	 *                   example: Pagamento realizado com sucesso
	 *                 data:
	 *                   $ref: '#/components/schemas/TransactionWithClientGateway'
	 *       '400':
	 *         description: Não foi possível processar o pagamento.
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               required:
	 *                 - message
	 *                 - data
	 *               properties:
	 *                 message:
	 *                   type: string
	 *                   example: Não foi possível processar o pagamento
	 *                 data:
	 *                   $ref: '#/components/schemas/Transaction'
	 *       '422':
	 *         description: Erro de validação.
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/ValidationErrorResponse'
	 */
	async store({ request, response }: HttpContext) {
		const payload = await request.validateUsing(createPurchaseValidator)
		const trx = await db.transaction()

		try {
			const client = await Client.firstOrCreate(
				{ email: payload.email },
				{
					name: payload.name,
					email: payload.email,
				},
				{ client: trx },
			)

			let total = 0

			// Coloquei para fazer merge com id de produtos iguais, ou era isso, ou validar com distinct no vinejs
			const mergedProducts = new Map<number, number>()

			for (const item of payload.products) {
				mergedProducts.set(
					item.id,
					(mergedProducts.get(item.id) ?? 0) + item.quantity,
				)
			}

			const normalizedProducts = Array.from(mergedProducts.entries()).map(
				([id, quantity]) => ({ id, quantity }),
			)

			const productIds = normalizedProducts.map((item) => item.id)
			const products = await Product.query({ client: trx }).whereIn(
				"id",
				productIds,
			)

			const productsMap = new Map(products.map((p) => [p.id, p]))

			const items = normalizedProducts.map((item) => {
				const product = productsMap.get(item.id)!

				total += item.quantity * product.amount

				return {
					productId: product.id,
					quantity: item.quantity,
				}
			})

			let paymentResult: ProcessResult
			try {
				const paymentProcessor = new PaymentProcessorService()
				paymentResult = await paymentProcessor.process({
					amount: total,
					name: payload.name,
					email: payload.email,
					cardNumber: payload.cardNumber,
					cvv: payload.cvv,
				})
			} catch (e: any) {
				await trx.rollback()

				return response.badRequest({
					message: e.message,
				})
			}

			const transaction = await Transaction.create(
				{
					clientId: client.id,
					status: paymentResult.success ? "paid" : "failed",
					amount: total,
					cardLastNumbers: payload.cardNumber.slice(-4),
					gatewayId: paymentResult.success ? paymentResult.gatewayId! : null,
					externalId: paymentResult.success ? paymentResult.externalId! : null,
				},
				{ client: trx },
			)

			await transaction.related("transactionProducts").createMany(items, {
				client: trx,
			})

			await trx.commit()

			if (paymentResult.success) {
				await transaction.load("gateway")
				await transaction.load("client")

				return response.ok({
					message: "Pagamento realizado com sucesso",
					data: transaction,
				})
			}

			return response.badRequest({
				message: "Não foi possível processar o pagamento",
				data: transaction,
			})
		} catch (error) {
			await trx.rollback()
			throw error
		}
	}
}
