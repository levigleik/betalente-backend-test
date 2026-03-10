import {
	transactionDetailExample,
	transactionDetailResponseExample,
	transactionExample,
	transactionListExample,
	transactionRefundResponseExample,
} from "../examples/transactions.ts"
import {
	createPurchaseExample,
	purchaseSuccessExample,
} from "../examples/purchases.ts"
import type { SchemaOverride } from "../types.ts"

export const transactionSchemaOverrides: Record<string, SchemaOverride> = {
	TransactionDto: {
		example: transactionExample,
	},
	TransactionDetailDto: {
		example: transactionDetailExample,
	},
	TransactionListResponseDto: {
		example: transactionListExample,
	},
	TransactionDetailResponseDto: {
		example: transactionDetailResponseExample,
	},
	TransactionMessageDataResponseDto: {
		example: transactionRefundResponseExample,
	},
	MessageResponseDto: {
		example: { message: "Operação realizada com sucesso" },
	},
	CreatePurchaseDto: {
		example: createPurchaseExample,
	},
	PurchaseSuccessResponseDto: {
		example: purchaseSuccessExample,
	},
}
