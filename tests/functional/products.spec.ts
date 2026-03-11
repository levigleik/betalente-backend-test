import testUtils from "@adonisjs/core/services/test_utils"
import { test } from "@japa/runner"
import Product from "#models/product"
import User from "#models/user"

test.group("Products", (group) => {
	let authUser: User

	group.each.setup(() => testUtils.db().truncate())

	group.each.setup(async () => {
		authUser = await User.create({
			fullName: "Admin User",
			email: "admin@example.com",
			password: "secretpassword",
		})
	})

	test("list products", async ({ client, assert }) => {
		await Product.createMany([
			{ name: "Product A", amount: 100 },
			{ name: "Product B", amount: 200 },
		])

		const response = await client.get("/v1/products").loginAs(authUser)

		response.assertStatus(200)
		const body = response.body() as any
		assert.isArray(body.data)
		assert.lengthOf(body.data, 2)
	})

	test("show product details", async ({ client, assert }) => {
		const p = await Product.create({ name: "Prod A", amount: 50 })

		const response = await client.get(`/v1/products/${p.id}`).loginAs(authUser)

		response.assertStatus(200)
		const body = response.body() as any
		assert.equal(body.data.id, p.id)
		assert.equal(body.data.name, "Prod A")
	})

	test("return 404 for unknown product id", async ({ client }) => {
		const response = await client.get("/v1/products/99999").loginAs(authUser)

		response.assertStatus(404)
		response.assertBodyContains({
			message: "Registro não encontrado",
		})
	})

	test("create product", async ({ client, assert }) => {
		const payload = { name: "New Product", amount: 150 }

		const response = await client
			.post("/v1/products")
			.json(payload)
			.loginAs(authUser)

		response.assertStatus(201)
		const body = response.body() as any
		assert.equal(body.message, "Produto criado com sucesso")
		assert.equal(body.data.name, "New Product")
		assert.equal(body.data.amount, 150)
	})

	test("update product", async ({ client, assert }) => {
		const p = await Product.create({ name: "Old Name", amount: 50 })
		const payload = { name: "New Name", amount: 60 }

		const response = await client
			.put(`/v1/products/${p.id}`)
			.json(payload)
			.loginAs(authUser)

		response.assertStatus(200)
		const body = response.body() as any
		assert.equal(body.message, "Produto atualizado com sucesso")
		assert.equal(body.data.name, "New Name")
		assert.equal(body.data.amount, 60)

		const dbP = await Product.findOrFail(p.id)
		assert.equal(dbP.name, "New Name")
	})

	test("delete product", async ({ client, assert }) => {
		const p = await Product.create({ name: "To Delete", amount: 50 })

		const response = await client
			.delete(`/v1/products/${p.id}`)
			.loginAs(authUser)

		response.assertStatus(200)
		const body = response.body() as any
		assert.equal(body.message, "Produto removido com sucesso")

		const dbP = await Product.find(p.id)
		assert.isNull(dbP)
	})
})
