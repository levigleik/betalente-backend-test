import testUtils from "@adonisjs/core/services/test_utils"
import { test } from "@japa/runner"
import Client from "#models/client"
import Gateway from "#models/gateway"
import Transaction from "#models/transaction"
import User from "#models/user"
import env from "#start/env"

test.group("Transactions", (group) => {
	let authUser: User
	let clientInDb: Client
	let gatewayInDb: Gateway

	group.each.setup(() => testUtils.db().truncate())

	group.setup(async () => {
		// Relying on external gateways defined in docker-compose.yml
		// running on ports 3001 and 3002
	})

	group.each.setup(async () => {
		authUser = await User.create({
			fullName: "Admin User",
			email: "admin@example.com",
			password: "secretpassword",
		})

		clientInDb = await Client.create({
			name: "John Client",
			email: "john.client@example.com",
		})

		await Gateway.createMany([
			{ name: "gateway_1", priority: 1, isActive: true },
			{ name: "gateway_2", priority: 2, isActive: true },
		])

		gatewayInDb = await Gateway.findByOrFail("name", "gateway_1")
	})

	test("list transactions", async ({ client, assert }) => {
		await Transaction.create({
			clientId: clientInDb.id,
			gatewayId: gatewayInDb.id,
			status: "paid",
			amount: 150.0,
			cardLastNumbers: "1234",
			externalId: "ext_1",
		})

		const response = await client.get("/v1/transactions").loginAs(authUser)

		response.assertStatus(200)
		const body = response.body() as any
		assert.isArray(body.data)
		assert.lengthOf(body.data, 1)
		assert.equal(body.data[0].amount, 150)
	})

	test("show transaction details", async ({ client, assert }) => {
		const trx = await Transaction.create({
			clientId: clientInDb.id,
			gatewayId: gatewayInDb.id,
			status: "paid",
			amount: 150.0,
			cardLastNumbers: "1234",
			externalId: "ext_1",
		})

		const response = await client
			.get(`/v1/transactions/${trx.id}`)
			.loginAs(authUser)

		response.assertStatus(200)
		const body = response.body() as any
		assert.equal(body.data.id, trx.id)
		assert.equal(body.data.client.id, clientInDb.id)
		assert.equal(body.data.gateway.id, gatewayInDb.id)
	})

	test("return 404 for unknown transaction id", async ({ client }) => {
		const response = await client
			.get("/v1/transactions/99999")
			.loginAs(authUser)

		response.assertStatus(404)
		response.assertBodyContains({
			message: "Registro não encontrado",
		})
	})

	test("refund transaction successfully", async ({ client, assert }) => {
		const purchaseResponse = await client.post("/v1/purchase").json({
			name: "Refund User",
			email: "refund.user@example.com",
			amount: 100,
			cardNumber: "1111222233334444",
			cvv: "123",
		})

		purchaseResponse.assertStatus(200)
		const transactionId = purchaseResponse.body().data.id

		const response = await client
			.post(`/v1/transactions/${transactionId}/refund`)
			.loginAs(authUser)

		response.assertStatus(200)
		const body = response.body() as any
		assert.equal(body.message, "Reembolso realizado com sucesso")
		assert.equal(body.data.status, "refunded")

		const dbTrx = await Transaction.find(transactionId)
		assert.equal(dbTrx?.status, "refunded")
	})

	test("refuse refund if not paid", async ({ client, assert }) => {
		const trx = await Transaction.create({
			clientId: clientInDb.id,
			gatewayId: gatewayInDb.id,
			status: "pending",
			amount: 150.0,
			cardLastNumbers: "1234",
			externalId: "ext_1",
		})

		const response = await client
			.post(`/v1/transactions/${trx.id}/refund`)
			.loginAs(authUser)

		response.assertStatus(400)
		const body = response.body() as any
		assert.equal(
			body.message,
			"Somente transações pagas podem ser reembolsadas",
		)
	})

	test("return error from gateway refund", async ({ client, assert }) => {
		const purchaseResponse = await client.post("/v1/purchase").json({
			name: "Refund Failure User",
			email: "refund.failure@example.com",
			amount: 100,
			cardNumber: "1111222233334444",
			cvv: "123",
		})

		purchaseResponse.assertStatus(200)
		const transactionId = purchaseResponse.body().data.id
		const transaction = await Transaction.findOrFail(transactionId)
		await transaction.load("gateway")

		const gatewayUrlKey =
			transaction.gateway?.name === "gateway_2"
				? "GATEWAY_2_URL"
				: "GATEWAY_1_URL"
		const originalUrl = env.get(gatewayUrlKey)
		env.set(gatewayUrlKey, "http://localhost:59999")

		const response = await client
			.post(`/v1/transactions/${transaction.id}/refund`)
			.loginAs(authUser)

		env.set(gatewayUrlKey, originalUrl as string)

		response.assertStatus(400)
		const body = response.body() as any
		assert.equal(body.message, "Falha ao realizar reembolso no gateway")

		const dbTrx = await Transaction.findOrFail(transaction.id)
		assert.equal(dbTrx.status, "paid")
	})

	test("return 404 when refunding unknown transaction", async ({ client }) => {
		const response = await client
			.post("/v1/transactions/99999/refund")
			.loginAs(authUser)

		response.assertStatus(404)
		response.assertBodyContains({
			message: "Registro não encontrado",
		})
	})
})
