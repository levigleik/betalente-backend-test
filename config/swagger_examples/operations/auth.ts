import {
	authSuccessExample,
	authenticatedUserExample,
	invalidCredentialsExample,
	loginExample,
	logoutSuccessExample,
	signupExample,
} from "../examples/auth.ts"
import type { OperationOverride } from "../types.js"

export const authOperationOverrides: Record<
	string,
	Record<string, OperationOverride>
> = {
	"/v1/auth/signup": {
		post: {
			requestExample: signupExample,
			responses: {
				200: authSuccessExample,
			},
		},
	},
	"/v1/auth/login": {
		post: {
			requestExample: loginExample,
			responses: {
				200: authSuccessExample,
				401: invalidCredentialsExample,
			},
		},
	},
	"/v1/auth/logout": {
		post: {
			responses: {
				200: logoutSuccessExample,
			},
		},
	},
	"/v1/account/profile": {
		get: {
			responses: {
				200: authenticatedUserExample,
			},
		},
	},
}
