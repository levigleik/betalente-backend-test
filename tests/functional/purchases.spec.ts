import testUtils from "@adonisjs/core/services/test_utils"
import { test } from "@japa/runner"
import Gateway from "#models/gateway"
import Transaction from "#models/transaction"
import env from "#start/env"
import {
	createProducts,
	makePurchasePayload,
	seedDefaultGateways,
} from "../helpers/test_data.js"

test.group("Purchases", (group) => {
	let productA: Awaited<ReturnType<typeof createProducts>>[number]
	let productB: Awaited<ReturnType<typeof createProducts>>[number]

	group.each.setup(() => testUtils.db().truncate())

	group.each.setup(async () => {
		await seedDefaultGateways()

		;[productA, productB] = await createProducts()
	})

	test("process purchase and calculate total on backend", async ({
		client,
		assert,
	}) => {
		const payload = makePurchasePayload([
			{ id: productA.id, quantity: 1 },
			{ id: productA.id, quantity: 2 },
			{ id: productB.id, quantity: 1 },
		])

		const response = await client.post("/v1/purchase").json(payload)

		response.assertStatus(200)
		const body = response.body() as any
		assert.equal(body.message, "Pagamento realizado com sucesso")
		assert.equal(body.data.status, "paid")
		assert.equal(body.data.amount, 550)
		assert.match(
			body.data.externalId,
			/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
		)

		const transaction = await Transaction.query()
			.where("id", body.data.id)
			.preload("transactionProducts")
			.firstOrFail()

		assert.lengthOf(transaction.transactionProducts, 2)
		const transactionProducts = transaction.transactionProducts.sort(
			(a, b) => a.productId - b.productId,
		)
		assert.equal(transactionProducts[0].productId, productA.id)
		assert.equal(transactionProducts[0].quantity, 3)
		assert.equal(transactionProducts[1].productId, productB.id)
		assert.equal(transactionProducts[1].quantity, 1)
	})

	test("fallback to gateway 2 when gateway 1 fails", async ({
		client,
		assert,
	}) => {
		const gatewayTwo = await Gateway.findByOrFail("name", "gateway_2")
		const originalGatewayOneUrl = env.get("GATEWAY_1_URL")
		const payload = makePurchasePayload(
			[{ id: productA.id, quantity: 1 }],
			{ cardNumber: "4111111111111111" },
		)

		env.set("GATEWAY_1_URL", "http://localhost:3001/invalid")

		try {
			const response = await client.post("/v1/purchase").json(payload)

			response.assertStatus(200)
			const body = response.body() as any
			assert.equal(body.data.status, "paid")
			assert.equal(body.data.gatewayId, gatewayTwo.id)
			assert.match(
				body.data.externalId,
				/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
			)
		} finally {
			env.set("GATEWAY_1_URL", originalGatewayOneUrl)
		}
	})

	test("return bad request when all gateways fail", async ({
		client,
		assert,
	}) => {
		const originalGatewayOneUrl = env.get("GATEWAY_1_URL")
		const originalGatewayTwoUrl = env.get("GATEWAY_2_URL")
		const payload = makePurchasePayload(
			[{ id: productA.id, quantity: 1 }],
			{ cardNumber: "4111111111111111" },
		)

		env.set("GATEWAY_1_URL", "http://localhost:3001/invalid")
		env.set("GATEWAY_2_URL", "http://localhost:3002/invalid")

		try {
			const response = await client.post("/v1/purchase").json(payload)

			response.assertStatus(400)
			const body = response.body() as any
			assert.equal(body.message, "Não foi possível processar o pagamento")
			assert.equal(body.data.status, "failed")
			assert.equal(body.data.amount, 100)
		} finally {
			env.set("GATEWAY_1_URL", originalGatewayOneUrl)
			env.set("GATEWAY_2_URL", originalGatewayTwoUrl)
		}
	})

	test("validate purchase payload", async ({ client, assert }) => {
		const response = await client.post("/v1/purchase").json({
			name: "Invalid Purchase",
			email: "invalid.purchase@example.com",
			products: [],
			cardNumber: "123",
			cvv: "1",
		})

		response.assertStatus(422)
		const body = response.body() as any
		assert.isArray(body.errors)
	})
})
