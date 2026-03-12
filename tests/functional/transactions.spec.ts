import testUtils from "@adonisjs/core/services/test_utils"
import { test } from "@japa/runner"
import Client from "#models/client"
import Gateway from "#models/gateway"
import Product from "#models/product"
import Transaction from "#models/transaction"
import User from "#models/user"
import {
	createAdminUser,
	makePurchasePayload,
	seedDefaultGateways,
} from "../helpers/test_data.js"

test.group("Transactions", (group) => {
	let admin: User
	let clientInDb: Client
	let gatewayOne: Gateway
	let product: Product

	group.each.setup(() => testUtils.db().truncate())

	group.each.setup(async () => {
		admin = await createAdminUser()
		clientInDb = await Client.create({
			name: "John Client",
			email: "john.client@example.com",
		})

		await seedDefaultGateways()
		gatewayOne = await Gateway.findByOrFail("name", "gateway_1")
		product = await Product.create({
			name: "Listed Product",
			amount: 150,
		})
	})

	test("list transactions", async ({ client, assert }) => {
		await Transaction.create({
			clientId: clientInDb.id,
			gatewayId: gatewayOne.id,
			status: "paid",
			amount: 150,
			cardLastNumbers: "1234",
			externalId: "ext_1",
		})

		const response = await client.get("/v1/transactions").loginAs(admin)

		response.assertStatus(200)
		const body = response.body() as any
		assert.isArray(body.data)
		assert.lengthOf(body.data, 1)
		assert.equal(body.data[0].client.id, clientInDb.id)
		assert.equal(body.data[0].gateway.id, gatewayOne.id)
	})

	test("show transaction details with products", async ({ client, assert }) => {
		const transaction = await Transaction.create({
			clientId: clientInDb.id,
			gatewayId: gatewayOne.id,
			status: "paid",
			amount: 300,
			cardLastNumbers: "1234",
			externalId: "ext_2",
		})
		await transaction.related("transactionProducts").create({
			productId: product.id,
			quantity: 2,
		})

		const response = await client
			.get(`/v1/transactions/${transaction.id}`)
			.loginAs(admin)

		response.assertStatus(200)
		const body = response.body() as any
		assert.equal(body.data.id, transaction.id)
		assert.equal(body.data.client.id, clientInDb.id)
		assert.equal(body.data.gateway.id, gatewayOne.id)
		assert.lengthOf(body.data.transactionProducts, 1)
		assert.equal(body.data.transactionProducts[0].product.id, product.id)
		assert.equal(body.data.transactionProducts[0].quantity, 2)
	})

	test("return 404 for unknown transaction id", async ({ client }) => {
		const response = await client
			.get("/v1/transactions/99999")
			.loginAs(admin)

		response.assertStatus(404)
		response.assertBodyContains({
			message: "Registro não encontrado",
		})
	})

	test("refund transaction successfully", async ({ client, assert }) => {
		const purchaseResponse = await client.post("/v1/purchase").json(
			makePurchasePayload([{ id: product.id, quantity: 2 }], {
				name: "Refunded User",
				email: "refunded.user@example.com",
			}),
		)

		purchaseResponse.assertStatus(200)
		const transactionId = purchaseResponse.body().data.id

		const response = await client
			.post(`/v1/transactions/${transactionId}/refund`)
			.loginAs(admin)

		response.assertStatus(200)
		const body = response.body() as any
		assert.equal(body.message, "Reembolso realizado com sucesso")
		assert.equal(body.data.status, "refunded")

		const dbTransaction = await Transaction.findOrFail(transactionId)
		assert.equal(dbTransaction.status, "refunded")
	})

	test("refuse refund if transaction is not paid", async ({ client, assert }) => {
		const transaction = await Transaction.create({
			clientId: clientInDb.id,
			gatewayId: gatewayOne.id,
			status: "pending",
			amount: 150,
			cardLastNumbers: "1234",
			externalId: "ext_pending",
		})

		const response = await client
			.post(`/v1/transactions/${transaction.id}/refund`)
			.loginAs(admin)

		response.assertStatus(400)
		const body = response.body() as any
		assert.equal(
			body.message,
			"Somente transações pagas podem ser reembolsadas",
		)
	})

	test("return error from gateway refund", async ({ client, assert }) => {
		const transaction = await Transaction.create({
			clientId: clientInDb.id,
			gatewayId: gatewayOne.id,
			status: "paid",
			amount: 200,
			cardLastNumbers: "9999",
			externalId: "11111111-1111-1111-1111-111111111111",
		})

		const response = await client
			.post(`/v1/transactions/${transaction.id}/refund`)
			.loginAs(admin)

		response.assertStatus(400)
		const body = response.body() as any
		assert.equal(body.message, "Falha ao realizar reembolso no gateway")

		const dbTransaction = await Transaction.findOrFail(transaction.id)
		assert.equal(dbTransaction.status, "paid")
	})

	test("return 404 when refunding unknown transaction", async ({ client }) => {
		const response = await client
			.post("/v1/transactions/99999/refund")
			.loginAs(admin)

		response.assertStatus(404)
		response.assertBodyContains({
			message: "Registro não encontrado",
		})
	})
})
