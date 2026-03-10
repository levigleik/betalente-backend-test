import { clientExample, clientListExample } from "../examples/clients.ts"
import { transactionExample } from "../examples/transactions.ts"
import type { SchemaOverride } from "../types.ts"

export const clientSchemaOverrides: Record<string, SchemaOverride> = {
	ClientDto: {
		example: clientExample,
	},
	ClientListResponseDto: {
		example: clientListExample,
	},
	ClientDetailResponseDto: {
		example: {
			data: {
				...clientExample,
				transactions: [transactionExample],
			},
		},
	},
	ClientWithTransactionsDto: {
		example: {
			...clientExample,
			transactions: [transactionExample],
		},
	},
}
