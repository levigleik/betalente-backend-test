import type { HttpContext } from "@adonisjs/core/http"
import UserTransformer from "#transformers/user_transformer"

export default class ProfileController {
	/**
	 * @show
	 * @summary Obter perfil
	 * @description Retorna os dados publicos do usuario autenticado.
	 * @responseBody 200 - <AuthenticatedUserDto>
	 */
	async show({ auth, serialize }: HttpContext) {
		return serialize(UserTransformer.transform(auth.getUserOrFail()))
	}
}
