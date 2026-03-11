import type { HttpContext } from "@adonisjs/core/http"
import db from "@adonisjs/lucid/services/db"
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
		const trx = await db.transaction()

		try {
			const gatewayId = Number(params.id)

			const { priority } = await request.validateUsing(
				updateGatewayPriorityValidator,
			)

			const gateway = await Gateway.query({ client: trx })
				.where("id", gatewayId)
				.where("isActive", true)
				.first()

			if (!gateway) {
				await trx.rollback()
				return response.notFound({
					message: "Gateway não encontrado",
				})
			}

			if (gateway.priority === priority) {
				await trx.rollback()
				return response.ok({
					message: "Prioridade já está definida nesse valor",
					data: gateway,
				})
			}

			const gatewayToSwap = await Gateway.query({ client: trx })
				.where("priority", priority)
				.where("isActive", true)
				.whereNot("id", gateway.id)
				.first()

			gateway.useTransaction(trx)
			gatewayToSwap?.useTransaction(trx)

			const oldPriority = gateway.priority

			gateway.priority = priority
			await gateway.save()

			if (gatewayToSwap) {
				gatewayToSwap.priority = oldPriority
				await gatewayToSwap.save()
			}

			await trx.commit()

			return response.ok({
				message: "Prioridade atualizada com sucesso",
				data: gateway,
			})
		} catch (error) {
			await trx.rollback()
			throw error
		}
	}
}
