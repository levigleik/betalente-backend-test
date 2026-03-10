import { test } from "@japa/runner"
import User from "#models/user"
import testUtils from "@adonisjs/core/services/test_utils"

test.group("Auth signup", (group) => {
	group.each.setup(() => testUtils.db().truncate())

	test("return error when required fields are missing", async ({
		client,
		assert,
	}) => {
		const response = await client.post("/v1/auth/signup").json({} as any)

		response.assertStatus(422)
		const body = response.body() as any
		assert.isArray(body.errors)
		const errFields = body.errors.map((e: any) => e.field)
		assert.includeMembers(errFields, ["email", "password"])
	})

	test("return error when password confirmation does not match", async ({
		client,
		assert,
	}) => {
		const response = await client.post("/v1/auth/signup").json({
			fullName: "John Doe",
			email: "johndoe@example.com",
			password: "secretpassword",
			passwordConfirmation: "wrongpassword",
		} as any)

		response.assertStatus(422)
		const body = response.body() as any
		assert.isArray(body.errors)
		const errFields = body.errors.map((e: any) => e.field)
		assert.includeMembers(errFields, ["passwordConfirmation"])
	})

	test("successfully create a new account", async ({ client, assert }) => {
		const response = await client.post("/v1/auth/signup").json({
			fullName: "John Doe",
			email: "johndoe@example.com",
			password: "secretpassword",
			passwordConfirmation: "secretpassword",
		})

		response.assertStatus(200)
		assert.properties(response.body(), ["data"])
		assert.properties(response.body().data, ["user"])
		assert.equal(response.body().data.user.email, "johndoe@example.com")

		const user = await User.findBy("email", "johndoe@example.com")
		assert.isNotNull(user)
		assert.equal(user?.fullName, "John Doe")
	})

	test("return error when email is already taken", async ({
		client,
		assert,
	}) => {
		await User.create({
			fullName: "Jane Doe",
			email: "janedoe@example.com",
			password: "secretpassword",
		})

		const response = await client.post("/v1/auth/signup").json({
			fullName: "Jane Doe 2",
			email: "janedoe@example.com",
			password: "secretpassword",
			passwordConfirmation: "secretpassword",
		} as any)

		response.assertStatus(422)
		const body = response.body() as any
		assert.isArray(body.errors)
		const errFields = body.errors.map((e: any) => e.field)
		assert.includeMembers(errFields, ["email"])
	})
})
