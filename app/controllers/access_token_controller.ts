import User from "#models/user"
import { loginValidator } from "#validators/user"
import type { HttpContext } from "@adonisjs/core/http"
import UserTransformer from "#transformers/user_transformer"

export default class AccessTokenController {
	/**
	 * @store
	 * @summary Fazer login
	 * @description Autentica um usuario e retorna seus dados publicos com um novo token de acesso.
	 * @requestBody <loginValidator>
	 * @responseBody 200 - <AuthSuccessResponseDto>
	 * @responseBody 401 - {"message": "Invalid credentials"}
	 */
	async store({ request, serialize }: HttpContext) {
		const { email, password } = await request.validateUsing(loginValidator)

		const user = await User.verifyCredentials(email, password)
		const token = await User.accessTokens.create(user)

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
	 * @destroy
	 * @summary Fazer logout
	 * @description Invalida o token de acesso atual do usuario autenticado.
	 * @responseBody 200 - <LogoutResponseDto>
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
