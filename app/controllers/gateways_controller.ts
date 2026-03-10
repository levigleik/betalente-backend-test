import type { HttpContext } from "@adonisjs/core/http"
import Gateway from "#models/gateway"
import { updateGatewayPriorityValidator } from "#validators/gateway"

export default class GatewaysController {
	/**
	 * @index
	 * @summary Listar gateways
	 * @responseBody 200 - <GatewayListResponseDto>
	 */
	async index({ response }: HttpContext) {
		const gateways = await Gateway.query().orderBy("priority", "asc")

		return response.ok({
			data: gateways,
		})
	}

	/**
	 * @toggle
	 * @summary Ativar/desativar gateway
	 * @responseBody 200 - <GatewayMessageDataResponseDto>
	 */
	async toggle({ params, response }: HttpContext) {
		const gateway = await Gateway.findOrFail(params.id)

		gateway.isActive = !gateway.isActive
		await gateway.save()

		return response.ok({
			message: "Gateway atualizado com sucesso",
			data: gateway,
		})
	}

	/**
	 * @updatePriority
	 * @summary Atualizar prioridade do gateway
	 * @requestBody <UpdateGatewayPriorityDto>
	 * @responseBody 200 - <GatewayMessageDataResponseDto>
	 */
	async updatePriority({ params, request, response }: HttpContext) {
		const gateway = await Gateway.findOrFail(params.id)

		const { priority } = await request.validateUsing(updateGatewayPriorityValidator)

		gateway.priority = priority
		await gateway.save()

		return response.ok({
			message: "Prioridade atualizada com sucesso",
			data: gateway,
		})
	}
}
