import { clientExample } from "./clients.ts"
import { gatewayOneExample } from "./gateways.ts"
import { productExample } from "./products.ts"

const timestamp = "2026-03-09T10:25:00.000Z"

export const transactionExample = {
	id: 1,
	clientId: 1,
	gatewayId: 1,
	externalId: "3d15e8ed-6131-446e-a7e3-456728b1211f",
	status: "paid",
	amount: 1000,
	cardLastNumbers: "6063",
	createdAt: timestamp,
	updatedAt: timestamp,
	client: clientExample,
	gateway: gatewayOneExample,
}

export const transactionProductExample = {
	id: 1,
	transactionId: 1,
	productId: 1,
	quantity: 1,
	createdAt: timestamp,
	updatedAt: timestamp,
	product: productExample,
}

export const transactionDetailExample = {
	...transactionExample,
	transactionProducts: [transactionProductExample],
}

export const transactionListExample = {
	data: [
		transactionExample,
		{
			...transactionExample,
			id: 2,
			externalId: "7a2f1c4d-8b3e-4f5a-9c6d-1e2f3a4b5c6d",
			status: "refunded",
		},
	],
}

export const transactionDetailResponseExample = {
	data: transactionDetailExample,
}

export const transactionRefundResponseExample = {
	message: "Reembolso realizado com sucesso",
	data: { ...transactionExample, status: "refunded" },
}
