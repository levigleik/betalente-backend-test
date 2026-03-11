import type { HttpContext } from "@adonisjs/core/http"
import User from "#models/user"
import UserTransformer from "#transformers/user_transformer"
import { signupValidator } from "#validators/user"

export default class NewAccountController {
	/**
	 * @store
	 * @summary Criar conta
	 * @description Cria um novo usuario e retorna os dados publicos junto com o token de acesso.
	 * @requestBody <signupValidator>
	 * @responseBody 200 - <SignupSuccessResponseDto>
	 */
	async store({ request, serialize }: HttpContext) {
		const { fullName, email, password } =
			await request.validateUsing(signupValidator)

		const user = await User.create({ fullName, email, password })

		return serialize({
			user: UserTransformer.transform(user),
		})
	}
}
