import Gateway from "#models/gateway"
import GatewayOneService from "#services/gateways/gateway_one_service"
import GatewayTwoService from "#services/gateways/gateway_two_service"

type ProcessPayload = {
	amount: number
	name: string
	email: string
	cardNumber: string
	cvv: string
}

export type ProcessResult = {
	success: boolean
	gatewayId?: number
	externalId?: string
	error?: string
}

export default class PaymentProcessorService {
	async process(payload: ProcessPayload): Promise<ProcessResult> {
		const gateways = await Gateway.query()
			.where("is_active", true)
			.orderBy("priority", "asc")

		for (const gateway of gateways) {
			let service: GatewayOneService | GatewayTwoService | null = null

			if (gateway.name === "gateway_1") {
				service = new GatewayOneService()
			}

			if (gateway.name === "gateway_2") {
				service = new GatewayTwoService()
			}

			if (!service) {
				continue
			}

			const result = await service.charge(payload)

			if (result.success && result.externalId) {
				return {
					success: true,
					gatewayId: gateway.id,
					externalId: result.externalId,
				}
			}
		}

		return {
			success: false,
			error: "Todos os gateways falharam",
		}
	}
}
