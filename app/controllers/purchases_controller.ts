import type { HttpContext } from "@adonisjs/core/http"
import Client from "#models/client"
import Transaction from "#models/transaction"
import PaymentProcessorService from "#services/payment_processor_service"
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

		const client = await Client.firstOrCreate(
			{ email: payload.email },
			{
				name: payload.name,
				email: payload.email,
			},
		)

		const transaction = await Transaction.create({
			clientId: client.id,
			status: "pending",
			amount: payload.amount,
			cardLastNumbers: payload.cardNumber.slice(-4),
		})

		const paymentProcessor = new PaymentProcessorService()

		const result = await paymentProcessor.process({
			amount: payload.amount,
			name: payload.name,
			email: payload.email,
			cardNumber: payload.cardNumber,
			cvv: payload.cvv,
		})

		if (result.success) {
			transaction.gatewayId = result.gatewayId!
			transaction.externalId = result.externalId!
			transaction.status = "paid"
			await transaction.save()

			await transaction.load("gateway")
			await transaction.load("client")

			return response.ok({
				message: "Pagamento realizado com sucesso",
				data: transaction,
			})
		}

		transaction.status = "failed"
		await transaction.save()

		return response.badRequest({
			message: "Não foi possível processar o pagamento",
			data: transaction,
		})
	}
}
