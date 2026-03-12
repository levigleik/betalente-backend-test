import { BaseSeeder } from "@adonisjs/lucid/seeders"
import User from "#models/user"
import env from "#start/env"

export default class extends BaseSeeder {
	async run() {
		// Write your database queries inside the run method
		await User.firstOrCreate(
			{ email: env.get("ADMIN_EMAIL") },
			{
				fullName: env.get("ADMIN_NAME"),
				email: env.get("ADMIN_EMAIL"),
				password: env.get("ADMIN_PASSWORD"),
				role: "ADMIN",
			},
		)
	}
}
