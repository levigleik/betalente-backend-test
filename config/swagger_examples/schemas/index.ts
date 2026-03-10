import { authSchemaOverrides } from "./auth.js"
import { clientSchemaOverrides } from "./clients.js"
import { gatewaySchemaOverrides } from "./gateways.js"
import { productSchemaOverrides } from "./products.js"
import { transactionSchemaOverrides } from "./transactions.js"
import type { SchemaOverride } from "../types.js"

export const schemaOverrides: Record<string, SchemaOverride> = {
	...authSchemaOverrides,
	...clientSchemaOverrides,
	...transactionSchemaOverrides,
	...productSchemaOverrides,
	...gatewaySchemaOverrides,
}
