import type { HttpContext } from "@adonisjs/core/http"
import db from "@adonisjs/lucid/services/db"
import Gateway from "#models/gateway"
import { updateGatewayPriorityValidator } from "#validators/gateway"

export default class GatewaysController {
	/**
	 * @openapi
	 * /v1/gateways:
	 *   get:
	 *     tags:
	 *       - Gateways
	 *     summary: Listar gateways
	 *     security:
	 *       - BearerAuth: []
	 *     responses:
	 *       '200':
	 *         description: Lista de gateways retornada com sucesso.
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               required:
	 *                 - data
	 *               properties:
	 *                 data:
	 *                   type: array
	 *                   items:
	 *                     $ref: '#/components/schemas/Gateway'
	 *       '401':
	 *         description: Token ausente ou inválido.
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/UnauthorizedResponse'
	 */
	async index({ response }: HttpContext) {
		const gateways = await Gateway.query().orderBy("priority", "asc")

		return response.ok({
			data: gateways,
		})
	}

	/**
	 * @openapi
	 * /v1/gateways/{id}/toggle:
	 *   patch:
	 *     tags:
	 *       - Gateways
	 *     summary: Ativar ou desativar gateway
	 *     security:
	 *       - BearerAuth: []
	 *     parameters:
	 *       - in: path
	 *         name: id
	 *         required: true
	 *         description: ID do gateway.
	 *         schema:
	 *           type: integer
	 *     responses:
	 *       '200':
	 *         description: Gateway atualizado com sucesso.
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               required:
	 *                 - message
	 *                 - data
	 *               properties:
	 *                 message:
	 *                   type: string
	 *                   example: Gateway atualizado com sucesso
	 *                 data:
	 *                   $ref: '#/components/schemas/Gateway'
	 *       '401':
	 *         description: Token ausente ou inválido.
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/UnauthorizedResponse'
	 *       '404':
	 *         description: Gateway não encontrado.
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/MessageResponse'
	 *             example:
	 *               message: Registro não encontrado
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
	 * @openapi
	 * /v1/gateways/{id}/priority:
	 *   patch:
	 *     tags:
	 *       - Gateways
	 *     summary: Atualizar prioridade do gateway
	 *     security:
	 *       - BearerAuth: []
	 *     parameters:
	 *       - in: path
	 *         name: id
	 *         required: true
	 *         description: ID do gateway.
	 *         schema:
	 *           type: integer
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             $ref: '#/components/schemas/UpdateGatewayPriorityRequest'
	 *     responses:
	 *       '200':
	 *         description: Prioridade atualizada com sucesso.
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               required:
	 *                 - message
	 *                 - data
	 *               properties:
	 *                 message:
	 *                   type: string
	 *                   example: Prioridade atualizada com sucesso
	 *                 data:
	 *                   $ref: '#/components/schemas/Gateway'
	 *       '401':
	 *         description: Token ausente ou inválido.
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/UnauthorizedResponse'
	 *       '404':
	 *         description: Gateway ativo não encontrado.
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/MessageResponse'
	 *             example:
	 *               message: Gateway não encontrado
	 *       '422':
	 *         description: Erro de validação.
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/ValidationErrorResponse'
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
