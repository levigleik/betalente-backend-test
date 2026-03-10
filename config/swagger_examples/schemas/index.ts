import { authSchemaOverrides } from "./auth.ts"
import { clientSchemaOverrides } from "./clients.ts"
import { gatewaySchemaOverrides } from "./gateways.ts"
import { productSchemaOverrides } from "./products.ts"
import { transactionSchemaOverrides } from "./transactions.ts"
import type { SchemaOverride } from "../types.ts"

export const schemaOverrides: Record<string, SchemaOverride> = {
	...authSchemaOverrides,
	...clientSchemaOverrides,
	...transactionSchemaOverrides,
	...productSchemaOverrides,
	...gatewaySchemaOverrides,
}
