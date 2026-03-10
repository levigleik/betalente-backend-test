import {
	transactionDetailResponseExample,
	transactionListExample,
	transactionRefundResponseExample,
} from "../examples/transactions.ts"
import type { OperationOverride } from "../types.ts"

export const transactionOperationOverrides: Record<
	string,
	Record<string, OperationOverride>
> = {
	"/v1/transactions": {
		get: {
			responses: {
				200: transactionListExample,
			},
		},
	},
	"/v1/transactions/{id}": {
		get: {
			responses: {
				200: transactionDetailResponseExample,
			},
		},
	},
	"/v1/transactions/{id}/refund": {
		post: {
			responses: {
				200: transactionRefundResponseExample,
				400: { message: "Transação não pode ser reembolsada" },
			},
		},
	},
}
