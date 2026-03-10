import type { HttpContext } from "@adonisjs/core/http"
import Transaction from "#models/transaction"
import RefundTransactionService from "#services/refund_transaction_service"

export default class TransactionsController {
	/**
	 * @index
	 * @summary Listar transações
	 * @responseBody 200 - <TransactionListResponseDto>
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
	 * @show
	 * @summary Obter transação
	 * @responseBody 200 - <TransactionDetailResponseDto>
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
	 * @refund
	 * @summary Reembolsar transação
	 * @responseBody 200 - <TransactionMessageDataResponseDto>
	 * @responseBody 400 - <MessageResponseDto>
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
