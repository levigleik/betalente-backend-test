import testUtils from "@adonisjs/core/services/test_utils"
import { test } from "@japa/runner"
import User from "#models/user"
import {
	createAdminUser,
	createRegularUser,
} from "../helpers/test_data.js"

test.group("Users", (group) => {
	group.each.setup(() => testUtils.db().truncate())

	test("list users as admin", async ({ client, assert }) => {
		const admin = await createAdminUser({
			email: "admin.list@example.com",
		})
		await createRegularUser({
			email: "user.list@example.com",
		})

		const response = await client.get("/v1/users").loginAs(admin)

		response.assertStatus(200)
		const body = response.body() as any
		assert.isArray(body.data)
		assert.lengthOf(body.data, 2)
	})

	test("forbid regular user from listing users", async ({ client }) => {
		const user = await createRegularUser()

		const response = await client.get("/v1/users").loginAs(user)

		response.assertStatus(403)
		response.assertBodyContains({
			message: "Você não tem permissão para acessar este recurso",
		})
	})

	test("show one user as admin", async ({ client, assert }) => {
		const admin = await createAdminUser()
		const user = await createRegularUser({
			fullName: "Shown User",
		})

		const response = await client.get(`/v1/users/${user.id}`).loginAs(admin)

		response.assertStatus(200)
		const body = response.body() as any
		assert.equal(body.data.id, user.id)
		assert.equal(body.data.fullName, "Shown User")
		assert.equal(body.data.role, "USER")
	})

	test("create user as admin", async ({ client, assert }) => {
		const admin = await createAdminUser()

		const response = await client
			.post("/v1/users")
			.json({
				fullName: "Created User",
				email: "created.user@example.com",
				password: "secretpassword",
				passwordConfirmation: "secretpassword",
			})
			.loginAs(admin)

		response.assertStatus(200)
		const body = response.body() as any
		assert.equal(body.data.user.email, "created.user@example.com")
		assert.notExists(body.data.user.role)

		const user = await User.findByOrFail("email", "created.user@example.com")
		assert.equal(user.role, "USER")
	})

	test("allow regular user to update own profile", async ({ client, assert }) => {
		const user = await createRegularUser({
			fullName: "Old Name",
		})

		const response = await client
			.put(`/v1/users/${user.id}`)
			.json({
				fullName: "New Name",
			})
			.loginAs(user)

		response.assertStatus(200)
		const body = response.body() as any
		assert.equal(body.message, "Usuário atualizado com sucesso")
		assert.equal(body.data.fullName, "New Name")

		const updatedUser = await User.findOrFail(user.id)
		assert.equal(updatedUser.fullName, "New Name")
	})

	test("delete regular user as admin", async ({ client, assert }) => {
		const admin = await createAdminUser()
		const user = await createRegularUser()

		const response = await client
			.delete(`/v1/users/${user.id}`)
			.loginAs(admin)

		response.assertStatus(200)
		const body = response.body() as any
		assert.equal(body.message, "Usuário removido com sucesso")
		assert.isNull(await User.find(user.id))
	})

	test("forbid admin from deleting itself", async ({ client }) => {
		const admin = await createAdminUser()

		const response = await client
			.delete(`/v1/users/${admin.id}`)
			.loginAs(admin)

		response.assertStatus(403)
		response.assertBodyContains({
			message: "Não é possível se auto excluir",
		})
	})

	test("forbid admin from deleting another admin", async ({ client }) => {
		const admin = await createAdminUser({
			email: "admin.one@example.com",
		})
		const otherAdmin = await createAdminUser({
			email: "admin.two@example.com",
		})

		const response = await client
			.delete(`/v1/users/${otherAdmin.id}`)
			.loginAs(admin)

		response.assertStatus(403)
		response.assertBodyContains({
			message: "Não é possível excluir outro administrador",
		})
	})
})
