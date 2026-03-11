import { test } from "@japa/runner"
import {
	readGatewayPayloadError,
} from "#services/gateways/gateway_response_utils"

test.group("Gateway response utils", () => {
	test("detects error payload even when HTTP status is 200", ({ assert }) => {
		const payload = {
			error: "Route Not Found",
			statusCode: 404,
		}

		const result = readGatewayPayloadError(payload)

		assert.deepEqual(result, {
			message: "Route Not Found",
			statusCode: 404,
		})
	})

	test("returns null when payload has no gateway error", ({ assert }) => {
		const payload = {
			id: "tx_123",
			status: "paid",
			statusCode: 200,
		}

		const result = readGatewayPayloadError(payload)

		assert.isNull(result)
	})
})
