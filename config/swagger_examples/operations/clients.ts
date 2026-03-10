import { clientExample, clientListExample } from "../examples/clients.ts"
import { transactionExample } from "../examples/transactions.ts"
import type { OperationOverride } from "../types.ts"

const clientWithTransactionsExample = {
	data: {
		...clientExample,
		transactions: [transactionExample],
	},
}

export const clientOperationOverrides: Record<
	string,
	Record<string, OperationOverride>
> = {
	"/v1/clients": {
		get: {
			responses: {
				200: clientListExample,
			},
		},
	},
	"/v1/clients/{id}": {
		get: {
			responses: {
				200: clientWithTransactionsExample,
			},
		},
	},
}
