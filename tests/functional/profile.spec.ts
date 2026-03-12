import testUtils from "@adonisjs/core/services/test_utils"
import { test } from "@japa/runner"
import {
	createRegularUser,
} from "../helpers/test_data.js"

test.group("Profile", (group) => {
	group.each.setup(() => testUtils.db().truncate())

	test("show authenticated user profile", async ({ client, assert }) => {
		const user = await createRegularUser({
			fullName: "Jane Doe",
			email: "jane.doe@example.com",
		})

		const response = await client.get("/v1/profile").loginAs(user)

		response.assertStatus(200)
		const body = response.body() as any
		assert.equal(body.data.email, "jane.doe@example.com")
		assert.equal(body.data.fullName, "Jane Doe")
		assert.notExists(body.data.password)
	})

	test("require authentication", async ({ client }) => {
		const response = await client.get("/v1/profile")

		response.assertStatus(401)
	})
})
