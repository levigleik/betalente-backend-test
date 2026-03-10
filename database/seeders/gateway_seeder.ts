import Gateway from "#models/gateway"
import { BaseSeeder } from "@adonisjs/lucid/seeders"

export default class extends BaseSeeder {
	async run() {
		await Gateway.firstOrCreate(
			{ name: "gateway_1" },
			{ isActive: true, priority: 1 },
		)

		await Gateway.firstOrCreate(
			{ name: "gateway_2" },
			{ isActive: true, priority: 2 },
		)
	}
}
