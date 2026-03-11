import axios from "axios"
import env from "#start/env"
import type {
	ChargePayload,
	ChargeResult,
	PaymentGatewayContract,
	RefundResult,
} from "./contracts/payment_gateway_contract.ts"
import {
	readGatewayPayloadError,
} from "./gateway_response_utils.ts"

export default class GatewayTwoService implements PaymentGatewayContract {
	private baseUrl = env.get("GATEWAY_2_URL")

	async charge(payload: ChargePayload): Promise<ChargeResult> {
		try {
			const response = await axios.post(`${this.baseUrl}/transacoes`, {
				valor: payload.amount,
				nome: payload.name,
				email: payload.email,
				numeroCartao: payload.cardNumber,
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
					error: "Resposta inválida do gateway 2: id ausente",
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
					error:
						payloadError?.message ||
						"Erro ao cobrar no gateway 2",
					rawResponse: error.response?.data,
				}
			}
			return {
				success: false,
				error:
					error instanceof Error
						? error.message
						: "Erro inesperado no gateway 2",
			}
		}
	}

	async refund(externalId: string): Promise<RefundResult> {
		try {
			const response = await axios.post<unknown>(
				`${this.baseUrl}/transacoes/reembolso`,
				{
					id: externalId,
				},
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
					error:
						payloadError?.message ||
						"Erro ao reembolsar no gateway 2",
					rawResponse: error.response?.data,
				}
			}
			return {
				success: false,
				error:
					error instanceof Error
						? error.message
						: "Erro inesperado no gateway 2",
			}
		}
	}
}
