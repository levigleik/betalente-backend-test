import {
	gatewayListExample,
	gatewayPriorityResponseExample,
	gatewayToggleResponseExample,
	updateGatewayPriorityExample,
} from "../examples/gateways.ts"
import type { OperationOverride } from "../types.ts"

export const gatewayOperationOverrides: Record<
	string,
	Record<string, OperationOverride>
> = {
	"/v1/gateways": {
		get: {
			responses: {
				200: gatewayListExample,
			},
		},
	},
	"/v1/gateways/{id}/toggle": {
		patch: {
			responses: {
				200: gatewayToggleResponseExample,
			},
		},
	},
	"/v1/gateways/{id}/priority": {
		patch: {
			requestExample: updateGatewayPriorityExample,
			responses: {
				200: gatewayPriorityResponseExample,
			},
		},
	},
}
