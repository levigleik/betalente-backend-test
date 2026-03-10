import {
	createProductExample,
	productCreateResponseExample,
	productExample,
	productListExample,
	productUpdateResponseExample,
} from "../examples/products.ts"
import type { SchemaOverride } from "../types.ts"

export const productSchemaOverrides: Record<string, SchemaOverride> = {
	ProductDto: {
		example: productExample,
	},
	ProductListResponseDto: {
		example: productListExample,
	},
	ProductDetailResponseDto: {
		example: { data: productExample },
	},
	ProductMessageDataResponseDto: {
		example: productCreateResponseExample,
	},
	CreateProductDto: {
		example: createProductExample,
	},
}
