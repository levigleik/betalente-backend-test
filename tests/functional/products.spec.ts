import testUtils from "@adonisjs/core/services/test_utils"
import { test } from "@japa/runner"
import Product from "#models/product"
import {
	createAdminUser,
	createRegularUser,
} from "../helpers/test_data.js"

test.group("Products", (group) => {
	group.each.setup(() => testUtils.db().truncate())

	test("list products as admin", async ({ client, assert }) => {
		const admin = await createAdminUser()
		await Product.createMany([
			{ name: "Product A", amount: 100 },
			{ name: "Product B", amount: 200 },
		])

		const response = await client.get("/v1/products").loginAs(admin)

		response.assertStatus(200)
		const body = response.body() as any
		assert.isArray(body.data)
		assert.lengthOf(body.data, 2)
	})

	test("forbid regular user from listing products", async ({ client }) => {
		const user = await createRegularUser()

		const response = await client.get("/v1/products").loginAs(user)

		response.assertStatus(403)
		response.assertBodyContains({
			message: "Você não tem permissão para acessar este recurso",
		})
	})

	test("show product details", async ({ client, assert }) => {
		const admin = await createAdminUser()
		const product = await Product.create({ name: "Prod A", amount: 50 })

		const response = await client
			.get(`/v1/products/${product.id}`)
			.loginAs(admin)

		response.assertStatus(200)
		const body = response.body() as any
		assert.equal(body.data.id, product.id)
		assert.equal(body.data.name, "Prod A")
	})

	test("return 404 for unknown product id", async ({ client }) => {
		const admin = await createAdminUser()

		const response = await client.get("/v1/products/99999").loginAs(admin)

		response.assertStatus(404)
		response.assertBodyContains({
			message: "Registro não encontrado",
		})
	})

	test("create product", async ({ client, assert }) => {
		const admin = await createAdminUser()

		const response = await client
			.post("/v1/products")
			.json({ name: "New Product", amount: 150 })
			.loginAs(admin)

		response.assertStatus(201)
		const body = response.body() as any
		assert.equal(body.message, "Produto criado com sucesso")
		assert.equal(body.data.name, "New Product")
		assert.equal(body.data.amount, 150)
	})

	test("validate product payload", async ({ client, assert }) => {
		const admin = await createAdminUser()

		const response = await client
			.post("/v1/products")
			.json({ name: "", amount: -1 })
			.loginAs(admin)

		response.assertStatus(422)
		const body = response.body() as any
		assert.isArray(body.errors)
	})

	test("update product", async ({ client, assert }) => {
		const admin = await createAdminUser()
		const product = await Product.create({ name: "Old Name", amount: 50 })

		const response = await client
			.put(`/v1/products/${product.id}`)
			.json({ name: "New Name", amount: 60 })
			.loginAs(admin)

		response.assertStatus(200)
		const body = response.body() as any
		assert.equal(body.message, "Produto atualizado com sucesso")
		assert.equal(body.data.name, "New Name")
		assert.equal(body.data.amount, 60)

		const updatedProduct = await Product.findOrFail(product.id)
		assert.equal(updatedProduct.name, "New Name")
	})

	test("delete product", async ({ client, assert }) => {
		const admin = await createAdminUser()
		const product = await Product.create({ name: "To Delete", amount: 50 })

		const response = await client
			.delete(`/v1/products/${product.id}`)
			.loginAs(admin)

		response.assertStatus(200)
		const body = response.body() as any
		assert.equal(body.message, "Produto removido com sucesso")
		assert.isNull(await Product.find(product.id))
	})
})
