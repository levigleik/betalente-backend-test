import {
	authSuccessExample,
	authenticatedUserExample,
	loginExample,
	logoutSuccessExample,
	signupExample,
} from "../examples/auth.ts";
import type { SchemaOverride } from "../types.ts";

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
	LogoutResponseDto: {
		example: logoutSuccessExample,
	},
};
