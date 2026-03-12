import type { HttpContext } from "@adonisjs/core/http"
import type { NextFn } from "@adonisjs/core/types/http"

type RoleOptions = {
	roles: string[]
}

export default class RoleMiddleware {
	async handle(
		{ auth, response }: HttpContext,
		next: NextFn,
		options: RoleOptions,
	) {
		const user = auth.getUserOrFail()

		if (!options.roles.includes(user.role)) {
			return response.forbidden({
				message: "Você não tem permissão para acessar este recurso",
			})
		}

		await next()
	}
}
