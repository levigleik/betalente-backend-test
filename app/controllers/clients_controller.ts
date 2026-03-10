import Client from "#models/client"
import type { HttpContext } from "@adonisjs/core/http"

export default class ClientsController {
	async index({ response }: HttpContext) {
		const clients = await Client.query().orderBy("id", "desc")

		return response.ok({
			data: clients,
		})
	}

	async show({ params, response }: HttpContext) {
		const client = await Client.query()
			.where("id", params.id)
			.preload("transactions", (transactionsQuery) => {
				transactionsQuery.preload("gateway")
			})
			.firstOrFail()

		return response.ok({
			data: client,
		})
	}
}
