import { test } from "@japa/runner"
import testUtils from "@adonisjs/core/services/test_utils"
// import User from '#models/user'
import Gateway from "#models/gateway"
import Transaction from "#models/transaction"
import env from "#start/env"

test.group("Purchases", (group) => {
	// let authUser: User

	group.each.setup(() => testUtils.db().truncate())

	group.setup(async () => {
		// Relying on external gateways defined in docker-compose.yml
		// running on ports 3001 and 3002
	})

	group.each.setup(async () => {
		// Generate auth user for routes that might need auth
		// Purchases is public in routes.ts! Route: router.post("purchase", [controllers.Purchases, "store"]).prefix("v1")
		// Let's seed the gateways so PaymentProcessor works
		await Gateway.createMany([
			{ name: "gateway_1", priority: 1, isActive: true },
			{ name: "gateway_2", priority: 2, isActive: true },
		])
	})

	test("successfully process a purchase via gateway 1", async ({
		client,
		assert,
	}) => {
		const payload = {
			name: "John Doe",
			email: "john@example.com",
			amount: 100,
			cardNumber: "1111222233334444",
			cvv: "123",
		}

		const response = await client.post("/v1/purchase").json(payload)

		response.assertStatus(200)
		assert.equal(response.body().message, "Pagamento realizado com sucesso")
		assert.exists(response.body().data.id)
		assert.equal(response.body().data.status, "paid")
		assert.equal(response.body().data.cardLastNumbers, "4444")

		const transaction = await Transaction.find(response.body().data.id)
		assert.isNotNull(transaction)
		assert.equal(transaction?.status, "paid")
		assert.isString(transaction?.externalId) // UUID from real gateway
	})

	test("fallback to gateway 2 if gateway 1 fails", async ({
		client,
		assert,
	}) => {
		// Break Gateway 1 URL temporarily to force a failure
		const originalUrl = env.get("GATEWAY_1_URL")
		env.set("GATEWAY_1_URL", "http://localhost:59999") // Invalid port

		const payload = {
			name: "John Doe",
			email: "john@example.com",
			amount: 100,
			cardNumber: "1111222233334444",
			cvv: "123",
		}

		const response = await client.post("/v1/purchase").json(payload)

		// Restore URL
		env.set("GATEWAY_1_URL", originalUrl as string)

		response.assertStatus(200)
		assert.equal(response.body().message, "Pagamento realizado com sucesso")
		assert.equal(response.body().data.status, "paid")

		const transaction = await Transaction.find(response.body().data.id)
		assert.isNotNull(transaction)
		assert.equal(transaction?.status, "paid")
		assert.isString(transaction?.externalId)
		// Gateway 2 should have processed it
		assert.equal(transaction?.gatewayId, 2)
	})

	test("return bad request if all gateways fail", async ({
		client,
		assert,
	}) => {
		// Turn off gateway 2 to simulate total failure
		await Gateway.query().where("name", "gateway_2").update({ isActive: false })

		// Break Gateway 1 URL temporarily to force a failure
		const originalUrl = env.get("GATEWAY_1_URL")
		env.set("GATEWAY_1_URL", "http://localhost:59999") // Invalid port

		const payload = {
			name: "John Doe",
			email: "john@example.com",
			amount: 100,
			cardNumber: "1111222233334444",
			cvv: "123",
		}

		const response = await client.post("/v1/purchase").json(payload)

		// Restore URL
		env.set("GATEWAY_1_URL", originalUrl as string)

		response.assertStatus(400)
		assert.equal(
			response.body().message,
			"Não foi possível processar o pagamento",
		)
		assert.equal(response.body().data.status, "failed")

		const transaction = await Transaction.find(response.body().data.id)
		assert.equal(transaction?.status, "failed")
	})
})
