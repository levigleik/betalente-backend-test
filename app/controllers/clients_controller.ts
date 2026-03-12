import type { HttpContext } from "@adonisjs/core/http"
import Client from "#models/client"

export default class ClientsController {
	/**
	 * @openapi
	 * /v1/clients:
	 *   get:
	 *     tags:
	 *       - Clients
	 *     summary: Listar clientes
	 *     security:
	 *       - BearerAuth: []
	 *     responses:
	 *       '200':
	 *         description: Lista de clientes retornada com sucesso.
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
	 *                     $ref: '#/components/schemas/Client'
	 *       '401':
	 *         description: Token ausente ou inválido.
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/UnauthorizedResponse'
	 */
	async index({ response }: HttpContext) {
		const clients = await Client.query().orderBy("id", "desc")

		return response.ok({
			data: clients,
		})
	}

	/**
	 * @openapi
	 * /v1/clients/{id}:
	 *   get:
	 *     tags:
	 *       - Clients
	 *     summary: Obter cliente
	 *     security:
	 *       - BearerAuth: []
	 *     parameters:
	 *       - in: path
	 *         name: id
	 *         required: true
	 *         description: ID do cliente.
	 *         schema:
	 *           type: integer
	 *     responses:
	 *       '200':
	 *         description: Cliente retornado com sucesso.
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               required:
	 *                 - data
	 *               properties:
	 *                 data:
	 *                   $ref: '#/components/schemas/ClientDetail'
	 *       '401':
	 *         description: Token ausente ou inválido.
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/UnauthorizedResponse'
	 *       '404':
	 *         description: Cliente não encontrado.
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/MessageResponse'
	 *             example:
	 *               message: Registro não encontrado
	 */
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
