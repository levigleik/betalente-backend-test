import User from "#models/user"
import { loginValidator } from "#validators/user"
import type { HttpContext } from "@adonisjs/core/http"
import UserTransformer from "#transformers/user_transformer"

export default class AccessTokenController {
	/**
	 * @openapi
	 * /v1/auth/login:
	 *   post:
	 *     tags:
	 *       - Auth
	 *     summary: Fazer login
	 *     description: Autentica um usuário e retorna seus dados públicos com um novo token de acesso.
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             $ref: '#/components/schemas/LoginRequest'
	 *     responses:
	 *       '200':
	 *         description: Login realizado com sucesso.
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               required:
	 *                 - data
	 *               properties:
	 *                 data:
	 *                   type: object
	 *                   required:
	 *                     - user
	 *                     - token
	 *                   properties:
	 *                     user:
	 *                       $ref: '#/components/schemas/UserPublic'
	 *                     token:
	 *                       type: string
	 *                       example: oat_qwerty1234567890
	 *       '400':
	 *         description: Credenciais inválidas.
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/MessageResponse'
	 *             example:
	 *               message: Invalid credentials
	 *       '422':
	 *         description: Erro de validação.
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/ValidationErrorResponse'
	 */
	async store({ request, serialize }: HttpContext) {
		const { email, password } = await request.validateUsing(loginValidator)

		const user = await User.verifyCredentials(email, password)
		const token = await User.accessTokens.create(user, undefined, {
			expiresIn: "1d",
		})

		return serialize({
			user: UserTransformer.transform(user),
			token: token.value!.release(),
		})
	}

	async nada({ serialize }: HttpContext) {
		return serialize({
			teste: "nada",
		})
	}

	/**
	 * @openapi
	 * /v1/auth/logout:
	 *   post:
	 *     tags:
	 *       - Auth
	 *     summary: Fazer logout
	 *     description: Invalida o token de acesso atual do usuário autenticado.
	 *     security:
	 *       - BearerAuth: []
	 *     responses:
	 *       '200':
	 *         description: Logout realizado com sucesso.
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/MessageResponse'
	 *             example:
	 *               message: Logged out successfully
	 *       '401':
	 *         description: Token ausente ou inválido.
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/UnauthorizedResponse'
	 */
	async destroy({ auth }: HttpContext) {
		const user = auth.getUserOrFail()
		if (user.currentAccessToken) {
			await User.accessTokens.delete(user, user.currentAccessToken.identifier)
		}

		return {
			message: "Logged out successfully",
		}
	}
}
