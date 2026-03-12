import type { HttpContext } from "@adonisjs/core/http"
import UserTransformer from "#transformers/user_transformer"

export default class ProfileController {
	/**
	 * @openapi
	 * /v1/profile:
	 *   get:
	 *     tags:
	 *       - Profile
	 *     summary: Obter perfil
	 *     description: Retorna os dados públicos do usuário autenticado.
	 *     security:
	 *       - BearerAuth: []
	 *     responses:
	 *       '200':
	 *         description: Perfil retornado com sucesso.
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               required:
	 *                 - data
	 *               properties:
	 *                 data:
	 *                   $ref: '#/components/schemas/UserPublic'
	 *       '401':
	 *         description: Token ausente ou inválido.
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/UnauthorizedResponse'
	 */
	async show({ auth, serialize }: HttpContext) {
		return serialize(UserTransformer.transform(auth.getUserOrFail()))
	}
}
