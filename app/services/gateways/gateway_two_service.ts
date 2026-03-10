import env from "#start/env";
import axios from "axios";
import type {
	PaymentGatewayContract,
	ChargePayload,
	ChargeResult,
	RefundResult,
} from "./contracts/payment_gateway_contract.ts";

interface ChargeApiResponse {
	id: number;
}

interface RefundApiResponse {
	id: string;
	name: string;
	email: string;
	status: string;
	card_first_digits: string;
	card_last_digits: string;
	amount: number;
}

export default class GatewayTwoService implements PaymentGatewayContract {
	private baseUrl = env.get("GATEWAY_2_URL");

	async charge(payload: ChargePayload): Promise<ChargeResult> {
		try {
			const response = await axios.post<ChargeApiResponse>(
				`${this.baseUrl}/transactions`,
				{
					valor: payload.amount,
					nome: payload.name,
					email: payload.email,
					numeroCartao: payload.cardNumber,
					cvv: payload.cvv,
				},
			);

			return {
				success: true,
				externalId: String(response.data.id),
				rawResponse: response.data,
			};
		} catch (error) {
			if (axios.isAxiosError(error)) {
				return {
					success: false,
					error: error.response?.data?.message || "Erro ao cobrar no gateway 2",
					rawResponse: error.response?.data,
				};
			}
			return {
				success: false,
				error:
					error instanceof Error
						? error.message
						: "Erro inesperado no gateway 1",
			};
		}
	}

	async refund(externalId: string): Promise<RefundResult> {
		try {
			const response = await axios.post<RefundApiResponse>(
				`${this.baseUrl}/transactions/${externalId}/charge_back`,
			);

			return {
				success: true,
				rawResponse: response.data,
			};
		} catch (error) {
			if (axios.isAxiosError(error)) {
				return {
					success: false,
					error:
						error.response?.data?.message || "Erro ao reembolsar no gateway 1",
					rawResponse: error.response?.data,
				};
			}
			return {
				success: false,
				error:
					error instanceof Error
						? error.message
						: "Erro inesperado no gateway 1",
			};
		}
	}
}
