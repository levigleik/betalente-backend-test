export const UserRoles = {
	ADMIN: "ADMIN",
	USER: "USER",
} as const

export type UserRole = (typeof UserRoles)[keyof typeof UserRoles]
