import axios from "axios"
import env from "#start/env"
import type {
	ChargePayload,
	ChargeResult,
	PaymentGatewayContract,
	RefundResult,
} from "./contracts/payment_gateway_contract.ts"
import { readGatewayPayloadError } from "./gateway_response_utils.ts"

export default class GatewayOneService implements PaymentGatewayContract {
	private baseUrl = env.get("GATEWAY_1_URL")

	async charge(payload: ChargePayload): Promise<ChargeResult> {
		try {
			const response = await axios.post(`${this.baseUrl}/transactions`, {
				amount: payload.amount,
				name: payload.name,
				email: payload.email,
				cardNumber: payload.cardNumber,
				cvv: payload.cvv,
			})

			const payloadError = readGatewayPayloadError(response.data)
			if (payloadError) {
				return {
					success: false,
					error: payloadError.message,
					rawResponse: response.data,
				}
			}

			const externalId = String(response.data?.id)
			if (!externalId) {
				return {
					success: false,
					error: "Resposta inválida do gateway 1: id ausente",
					rawResponse: response.data,
				}
			}

			return {
				success: true,
				externalId,
				rawResponse: response.data,
			}
		} catch (error) {
			if (axios.isAxiosError(error)) {
				const payloadError = readGatewayPayloadError(error.response?.data)

				return {
					success: false,
					error: payloadError?.message || "Erro ao cobrar no gateway 1",
					rawResponse: error.response?.data,
				}
			}
			return {
				success: false,
				error:
					error instanceof Error
						? error.message
						: "Erro inesperado no gateway 1",
			}
		}
	}

	async refund(externalId: string): Promise<RefundResult> {
		try {
			const response = await axios.post<unknown>(
				`${this.baseUrl}/transactions/${externalId}/charge_back`,
			)

			const payloadError = readGatewayPayloadError(response.data)
			if (payloadError) {
				return {
					success: false,
					error: payloadError.message,
					rawResponse: response.data,
				}
			}

			return {
				success: true,
				rawResponse: response.data,
			}
		} catch (error) {
			if (axios.isAxiosError(error)) {
				const payloadError = readGatewayPayloadError(error.response?.data)

				return {
					success: false,
					error: payloadError?.message || "Erro ao reembolsar no gateway 1",
					rawResponse: error.response?.data,
				}
			}
			return {
				success: false,
				error:
					error instanceof Error
						? error.message
						: "Erro inesperado no gateway 1",
			}
		}
	}
}
