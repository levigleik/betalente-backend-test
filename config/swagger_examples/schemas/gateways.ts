import {
	gatewayListExample,
	gatewayOneExample,
	gatewayPriorityResponseExample,
	gatewayToggleResponseExample,
	updateGatewayPriorityExample,
} from "../examples/gateways.ts"
import type { SchemaOverride } from "../types.ts"

export const gatewaySchemaOverrides: Record<string, SchemaOverride> = {
	GatewayDto: {
		example: gatewayOneExample,
	},
	GatewayListResponseDto: {
		example: gatewayListExample,
	},
	GatewayMessageDataResponseDto: {
		example: gatewayToggleResponseExample,
	},
	UpdateGatewayPriorityDto: {
		example: updateGatewayPriorityExample,
	},
}
