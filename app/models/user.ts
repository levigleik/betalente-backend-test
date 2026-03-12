import {
	AccessToken,
	DbAccessTokensProvider,
} from "@adonisjs/auth/access_tokens"
import { withAuthFinder } from "@adonisjs/auth/mixins/lucid"
import { compose } from "@adonisjs/core/helpers"
import hash from "@adonisjs/core/services/hash"
import { column } from "@adonisjs/lucid/orm"
import { UserSchema } from "#database/schema"
import type { UserRoles } from "../enums/user_role.js"

export default class User extends compose(UserSchema, withAuthFinder(hash)) {
	static accessTokens = DbAccessTokensProvider.forModel(User)
	declare currentAccessToken?: AccessToken

	@column()
	declare role: UserRoles

	get initials() {
		const [first, last] = this.fullName
			? this.fullName.split(" ")
			: this.email.split("@")
		if (first && last) {
			return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase()
		}
		return `${first.slice(0, 2)}`.toUpperCase()
	}
}
