import testUtils from "@adonisjs/core/services/test_utils"
import { test } from "@japa/runner"
import Gateway from "#models/gateway"
import User from "#models/user"

test.group("Gateways", (group) => {
	let authUser: User

	group.each.setup(() => testUtils.db().truncate())

	group.each.setup(async () => {
		authUser = await User.create({
			fullName: "Admin User",
			email: "admin@example.com",
			password: "secretpassword",
		})

		// Create default gateways to manipulate
		await Gateway.createMany([
			{ name: "gateway_1", priority: 1, isActive: true },
			{ name: "gateway_2", priority: 2, isActive: false },
		])
	})

	test("list gateways ordered by priority", async ({ client, assert }) => {
		const response = await client.get("/v1/gateways").loginAs(authUser)

		response.assertStatus(200)
		const body = response.body() as any
		assert.isArray(body.data)
		assert.lengthOf(body.data, 2)
		assert.equal(body.data[0].name, "gateway_1")
		assert.equal(body.data[0].priority, 1)
	})

	test("toggle gateway active status", async ({ client, assert }) => {
		const g = await Gateway.findByOrFail("name", "gateway_2") // is currently false

		const response = await client
			.patch(`/v1/gateways/${g.id}/toggle`)
			.loginAs(authUser)

		response.assertStatus(200)
		const body = response.body() as any
		assert.equal(body.message, "Gateway atualizado com sucesso")
		assert.isTrue(Boolean(body.data.isActive)) // turned true

		const dbG = await Gateway.findOrFail(g.id)
		assert.isTrue(Boolean(dbG.isActive))
	})

	test("return 404 when toggling unknown gateway", async ({ client }) => {
		const response = await client
			.patch("/v1/gateways/99999/toggle")
			.loginAs(authUser)

		response.assertStatus(404)
		response.assertBodyContains({
			message: "Registro não encontrado",
		})
	})

	test("update gateway priority", async ({ client, assert }) => {
		const g = await Gateway.findByOrFail("name", "gateway_1")
		const payload = { priority: 99 }

		const response = await client
			.patch(`/v1/gateways/${g.id}/priority`)
			.json(payload)
			.loginAs(authUser)

		response.assertStatus(200)
		const body = response.body() as any
		assert.equal(body.message, "Prioridade atualizada com sucesso")
		assert.equal(body.data.priority, 99)

		const dbG = await Gateway.findOrFail(g.id)
		assert.equal(dbG.priority, 99)
	})
})
