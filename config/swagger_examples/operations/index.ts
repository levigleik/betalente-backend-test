import { authOperationOverrides } from "./auth.js"
import { clientOperationOverrides } from "./clients.js"
import { gatewayOperationOverrides } from "./gateways.js"
import { productOperationOverrides } from "./products.js"
import { purchaseOperationOverrides } from "./purchases.js"
import { transactionOperationOverrides } from "./transactions.js"
import type { OperationOverride } from "../types.js"

export const operationOverrides: Record<
	string,
	Record<string, OperationOverride>
> = {
	...authOperationOverrides,
	...clientOperationOverrides,
	...transactionOperationOverrides,
	...productOperationOverrides,
	...purchaseOperationOverrides,
	...gatewayOperationOverrides,
}
