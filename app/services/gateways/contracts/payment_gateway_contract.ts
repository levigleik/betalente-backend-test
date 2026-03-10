export type ChargePayload = {
	amount: number;
	name: string;
	email: string;
	cardNumber: string;
	cvv: string;
};

export type ChargeResult = {
	success: boolean;
	externalId?: string;
	error?: string;
	rawResponse?: unknown;
};

export type RefundResult = {
	success: boolean;
	error?: string;
	rawResponse?: unknown;
};

export interface PaymentGatewayContract {
	charge(payload: ChargePayload): Promise<ChargeResult>;
	refund(externalId: string): Promise<RefundResult>;
}
