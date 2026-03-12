import type { HttpContext } from "@adonisjs/core/http"
import User from "#models/user"
import UserTransformer from "#transformers/user_transformer"
import { createUserValidator, updateUserValidator } from "#validators/user"

export default class UsersController {
	/**
	 * @openapi
	 * /v1/users:
	 *   get:
	 *     tags:
	 *       - Users
	 *     summary: Listar usuários
	 *     description: Requer autenticação e acesso permitido para a role ADMIN.
	 *     security:
	 *       - BearerAuth: []
	 *     responses:
	 *       '200':
	 *         description: Lista de usuários retornada com sucesso.
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
	 *                     $ref: '#/components/schemas/User'
	 *       '401':
	 *         description: Token ausente ou inválido.
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/UnauthorizedResponse'
	 *       '403':
	 *         description: Usuário sem permissão para acessar o recurso.
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/MessageResponse'
	 *             example:
	 *               message: Você não tem permissão para acessar este recurso
	 */
	async index({ response }: HttpContext) {
		const users = await User.all()

		return response.ok({
			data: users,
		})
	}

	/**
	 * @openapi
	 * /v1/users/{id}:
	 *   get:
	 *     tags:
	 *       - Users
	 *     summary: Obter usuário
	 *     description: Requer autenticação e acesso permitido para a role ADMIN.
	 *     security:
	 *       - BearerAuth: []
	 *     parameters:
	 *       - in: path
	 *         name: id
	 *         required: true
	 *         description: ID do usuário.
	 *         schema:
	 *           type: integer
	 *     responses:
	 *       '200':
	 *         description: Usuário retornado com sucesso.
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               required:
	 *                 - data
	 *               properties:
	 *                 data:
	 *                   $ref: '#/components/schemas/User'
	 *       '401':
	 *         description: Token ausente ou inválido.
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/UnauthorizedResponse'
	 *       '403':
	 *         description: Usuário sem permissão para acessar o recurso.
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/MessageResponse'
	 *             example:
	 *               message: Você não tem permissão para acessar este recurso
	 *       '404':
	 *         description: Usuário não encontrado.
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/MessageResponse'
	 *             example:
	 *               message: Registro não encontrado
	 */
	async show({ params, response }: HttpContext) {
		const user = await User.findOrFail(params.id)

		return response.ok({
			data: user,
		})
	}

	/**
	 * @openapi
	 * /v1/users:
	 *   post:
	 *     tags:
	 *       - Users
	 *     summary: Criar usuário
	 *     description: Requer autenticação e acesso permitido para o papel ADMIN.
	 *     security:
	 *       - BearerAuth: []
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             $ref: '#/components/schemas/CreateUserRequest'
	 *     responses:
	 *       '200':
	 *         description: Usuário criado com sucesso.
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
	 *                   properties:
	 *                     user:
	 *                       $ref: '#/components/schemas/UserPublic'
	 *       '401':
	 *         description: Token ausente ou inválido.
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/UnauthorizedResponse'
	 *       '403':
	 *         description: Usuário sem permissão para acessar o recurso.
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/MessageResponse'
	 *             example:
	 *               message: Você não tem permissão para acessar este recurso
	 *       '422':
	 *         description: Erro de validação.
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/ValidationErrorResponse'
	 */
	async store({ request, serialize }: HttpContext) {
		const { fullName, email, password } =
			await request.validateUsing(createUserValidator)

		const user = await User.create({ fullName, email, password, role: "USER" })

		return serialize({
			user: UserTransformer.transform(user),
		})
	}

	/**
	 * @openapi
	 * /v1/users/{id}:
	 *   put:
	 *     tags:
	 *       - Users
	 *     summary: Atualizar usuário
	 *     description: Requer autenticação e acesso permitido para a role ADMIN.
	 *     security:
	 *       - BearerAuth: []
	 *     parameters:
	 *       - in: path
	 *         name: id
	 *         required: true
	 *         description: ID do usuário.
	 *         schema:
	 *           type: integer
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             $ref: '#/components/schemas/UpdateUserRequest'
	 *     responses:
	 *       '200':
	 *         description: Usuário atualizado com sucesso.
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
	 *                   example: Usuário atualizado com sucesso
	 *                 data:
	 *                   $ref: '#/components/schemas/User'
	 *       '401':
	 *         description: Token ausente ou inválido.
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/UnauthorizedResponse'
	 *       '403':
	 *         description: Usuário sem permissão para acessar o recurso.
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/MessageResponse'
	 *             example:
	 *               message: Você não tem permissão para acessar este recurso
	 *       '404':
	 *         description: Usuário não encontrado.
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/MessageResponse'
	 *             example:
	 *               message: Registro não encontrado
	 *       '422':
	 *         description: Erro de validação.
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/ValidationErrorResponse'
	 */
	async update({ params, request, response }: HttpContext) {
		const user = await User.findOrFail(params.id)
		const payload = await request.validateUsing(updateUserValidator)

		user.merge(payload)
		await user.save()

		return response.ok({
			message: "Usuário atualizado com sucesso",
			data: user,
		})
	}

	/**
	 * @openapi
	 * /v1/users/{id}:
	 *   delete:
	 *     tags:
	 *       - Users
	 *     summary: Remover usuário
	 *     description: Requer autenticação e acesso permitido para a role ADMIN.
	 *     security:
	 *       - BearerAuth: []
	 *     parameters:
	 *       - in: path
	 *         name: id
	 *         required: true
	 *         description: ID do usuário.
	 *         schema:
	 *           type: integer
	 *     responses:
	 *       '200':
	 *         description: Usuário removido com sucesso.
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/MessageResponse'
	 *             example:
	 *               message: Usuário removido com sucesso
	 *       '401':
	 *         description: Token ausente ou inválido.
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/UnauthorizedResponse'
	 *       '403':
	 *         description: Usuário sem permissão para acessar o recurso.
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/MessageResponse'
	 *             example:
	 *               message: Você não tem permissão para acessar este recurso
	 *       '404':
	 *         description: Usuário não encontrado.
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/MessageResponse'
	 *             example:
	 *               message: Registro não encontrado
	 */
	async destroy({ params, response, auth }: HttpContext) {
		const user = await User.findOrFail(params.id)
		const userLoggedIn = auth.getUserOrFail()

		if (userLoggedIn?.id === user.id)
			return response.forbidden({
				message: "Não é possível se auto excluir",
			})

		if (user.role === "ADMIN")
			return response.forbidden({
				message: "Não é possível excluir outro administrador",
			})

		await user.delete()

		return response.ok({
			message: "Usuário removido com sucesso",
		})
	}
}
