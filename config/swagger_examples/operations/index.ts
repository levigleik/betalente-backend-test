import { authOperationOverrides } from "./auth.ts"
import { clientOperationOverrides } from "./clients.ts"
import { gatewayOperationOverrides } from "./gateways.ts"
import { productOperationOverrides } from "./products.ts"
import { purchaseOperationOverrides } from "./purchases.ts"
import { transactionOperationOverrides } from "./transactions.ts"
import type { OperationOverride } from "../types.ts"

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
