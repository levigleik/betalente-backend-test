import Transaction from "#models/transaction";
import GatewayOneService from "#services/gateways/gateway_one_service";
import GatewayTwoService from "#services/gateways/gateway_two_service";

type RefundResult = {
	success: boolean;
	message: string;
};

export default class RefundTransactionService {
	async execute(transaction: Transaction): Promise<RefundResult> {
		if (transaction.status !== "paid") {
			return {
				success: false,
				message: "Somente transações pagas podem ser reembolsadas",
			};
		}

		if (!transaction.gatewayId || !transaction.externalId) {
			return {
				success: false,
				message: "Transação sem gateway ou external_id válidos",
			};
		}

		await transaction.load("gateway");

		if (!transaction.gateway) {
			return {
				success: false,
				message: "Gateway não encontrado",
			};
		}

		let result = { success: false };

		if (transaction.gateway.name === "gateway_1") {
			result = await new GatewayOneService().refund(transaction.externalId);
		}

		if (transaction.gateway.name === "gateway_2") {
			result = await new GatewayTwoService().refund(transaction.externalId);
		}

		if (!result.success) {
			return {
				success: false,
				message: "Falha ao realizar reembolso no gateway",
			};
		}

		return {
			success: true,
			message: "Reembolso realizado com sucesso",
		};
	}
}
