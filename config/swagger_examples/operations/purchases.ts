import {
	createPurchaseExample,
	purchaseFailExample,
	purchaseSuccessExample,
} from "../examples/purchases.ts"
import type { OperationOverride } from "../types.ts"

export const purchaseOperationOverrides: Record<
	string,
	Record<string, OperationOverride>
> = {
	"/v1/purchase": {
		post: {
			requestExample: createPurchaseExample,
			responses: {
				200: purchaseSuccessExample,
				400: purchaseFailExample,
			},
		},
	},
}
