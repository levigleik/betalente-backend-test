import type { HttpContext } from "@adonisjs/core/http"
import Transaction from "#models/transaction"
import RefundTransactionService from "#services/refund_transaction_service"

export default class TransactionsController {
	/**
	 * @openapi
	 * /v1/transactions:
	 *   get:
	 *     tags:
	 *       - Transactions
	 *     summary: Listar transações
	 *     security:
	 *       - BearerAuth: []
	 *     responses:
	 *       '200':
	 *         description: Lista de transações retornada com sucesso.
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               required:
	 *                 - data
	 *               properties:
	 *                 data:
	 *                   type: array
	 *                   items:
	 *                     $ref: '#/components/schemas/TransactionWithClientGateway'
	 *       '401':
	 *         description: Token ausente ou inválido.
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/UnauthorizedResponse'
	 */
	async index({ response }: HttpContext) {
		const transactions = await Transaction.query()
			.preload("client")
			.preload("gateway")
			.orderBy("id", "desc")

		return response.ok({
			data: transactions,
		})
	}

	/**
	 * @openapi
	 * /v1/transactions/{id}:
	 *   get:
	 *     tags:
	 *       - Transactions
	 *     summary: Obter transação
	 *     security:
	 *       - BearerAuth: []
	 *     parameters:
	 *       - in: path
	 *         name: id
	 *         required: true
	 *         description: ID da transação.
	 *         schema:
	 *           type: integer
	 *     responses:
	 *       '200':
	 *         description: Transação retornada com sucesso.
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               required:
	 *                 - data
	 *               properties:
	 *                 data:
	 *                   $ref: '#/components/schemas/TransactionDetail'
	 *       '401':
	 *         description: Token ausente ou inválido.
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/UnauthorizedResponse'
	 *       '404':
	 *         description: Transação não encontrada.
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/MessageResponse'
	 *             example:
	 *               message: Registro não encontrado
	 */
	async show({ params, response }: HttpContext) {
		const transaction = await Transaction.query()
			.where("id", params.id)
			.preload("client")
			.preload("gateway")
			.preload("transactionProducts", (query) => {
				query.preload("product")
			})
			.firstOrFail()

		return response.ok({
			data: transaction,
		})
	}

	/**
	 * @openapi
	 * /v1/transactions/{id}/refund:
	 *   post:
	 *     tags:
	 *       - Transactions
	 *     summary: Reembolsar transação
	 *     security:
	 *       - BearerAuth: []
	 *     parameters:
	 *       - in: path
	 *         name: id
	 *         required: true
	 *         description: ID da transação.
	 *         schema:
	 *           type: integer
	 *     responses:
	 *       '200':
	 *         description: Reembolso realizado com sucesso.
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
	 *                   example: Reembolso realizado com sucesso
	 *                 data:
	 *                   $ref: '#/components/schemas/TransactionWithGateway'
	 *       '400':
	 *         description: Reembolso recusado por regra de negócio ou falha no gateway.
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/MessageResponse'
	 *             example:
	 *               message: Somente transações pagas podem ser reembolsadas
	 *       '401':
	 *         description: Token ausente ou inválido.
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/UnauthorizedResponse'
	 *       '404':
	 *         description: Transação não encontrada.
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/MessageResponse'
	 *             example:
	 *               message: Registro não encontrado
	 */
	async refund({ params, response }: HttpContext) {
		const transaction = await Transaction.query()
			.where("id", params.id)
			.preload("gateway")
			.firstOrFail()

		const refundService = new RefundTransactionService()
		const result = await refundService.execute(transaction)

		if (!result.success) {
			return response.badRequest({
				message: result.message,
			})
		}

		transaction.status = "refunded"
		await transaction.save()

		return response.ok({
			message: "Reembolso realizado com sucesso",
			data: transaction,
		})
	}
}
