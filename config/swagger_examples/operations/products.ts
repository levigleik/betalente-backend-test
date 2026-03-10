import {
	createProductExample,
	productCreateResponseExample,
	productDeleteResponseExample,
	productExample,
	productListExample,
	productUpdateResponseExample,
} from "../examples/products.ts"
import type { OperationOverride } from "../types.ts"

export const productOperationOverrides: Record<
	string,
	Record<string, OperationOverride>
> = {
	"/v1/products": {
		get: {
			responses: {
				200: productListExample,
			},
		},
		post: {
			requestExample: createProductExample,
			responses: {
				201: productCreateResponseExample,
			},
		},
	},
	"/v1/products/{id}": {
		get: {
			responses: {
				200: { data: productExample },
			},
		},
		put: {
			requestExample: createProductExample,
			responses: {
				200: productUpdateResponseExample,
			},
		},
		delete: {
			responses: {
				200: productDeleteResponseExample,
			},
		},
	},
}
