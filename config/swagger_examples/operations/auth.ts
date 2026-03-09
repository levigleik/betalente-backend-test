import {
	authSuccessExample,
	authenticatedUserExample,
	invalidCredentialsExample,
	loginExample,
	logoutSuccessExample,
	signupExample,
} from "../examples/auth.ts";
import type { OperationOverride } from "../types.js";

export const authOperationOverrides: Record<
	string,
	Record<string, OperationOverride>
> = {
	"/api/v1/auth/signup": {
		post: {
			requestExample: signupExample,
			responses: {
				200: authSuccessExample,
			},
		},
	},
	"/api/v1/auth/login": {
		post: {
			requestExample: loginExample,
			responses: {
				200: authSuccessExample,
				401: invalidCredentialsExample,
			},
		},
	},
	"/api/v1/auth/logout": {
		post: {
			responses: {
				200: logoutSuccessExample,
			},
		},
	},
	"/api/v1/account/profile": {
		get: {
			responses: {
				200: authenticatedUserExample,
			},
		},
	},
};
