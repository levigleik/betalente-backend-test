import {
	authSuccessExample,
	authenticatedUserExample,
	loginExample,
	logoutSuccessExample,
	signupExample,
	signupSuccessExample,
} from "../examples/auth.js"
import type { SchemaOverride } from "../types.js"

export const authSchemaOverrides: Record<string, SchemaOverride> = {
	signupValidator: {
		example: signupExample,
	},
	loginValidator: {
		example: loginExample,
	},
	AuthenticatedUserDto: {
		example: authenticatedUserExample,
	},
	AuthSuccessResponseDto: {
		example: authSuccessExample,
	},
	SignupSuccessResponseDto: {
		example: signupSuccessExample,
	},
	LogoutResponseDto: {
		example: logoutSuccessExample,
	},
}
