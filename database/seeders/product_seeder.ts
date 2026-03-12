import { BaseSeeder } from "@adonisjs/lucid/seeders"
import Product from "#models/product"

export default class extends BaseSeeder {
	async run() {
		await Product.firstOrCreate(
			{ id: 1 },
			{ name: "Garrafa térmica", amount: 70 },
		)
	}
}
