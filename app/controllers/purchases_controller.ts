import type { HttpContext } from "@adonisjs/core/http"
import Client from "#models/client"
import Transaction from "#models/transaction"
import PaymentProcessorService from "#services/payment_processor_service"
import { createPurchaseValidator } from "#validators/purchase"

export default class PurchasesController {
	/**
	 * @store
	 * @summary Realizar compra
	 * @requestBody <CreatePurchaseDto>
	 * @responseBody 200 - <PurchaseSuccessResponseDto>
	 * @responseBody 400 - <MessageResponseDto>
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
