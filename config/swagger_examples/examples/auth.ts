const userName = "Joao da Silva"
const userEmail = "joao.silva@betalent.com"
const userPassword = "S3cur3P4s5word!"
const userTimestamp = "2026-03-09T10:15:00.000Z"
const userInitials = "JS"
const accessToken = "oat_2mZ9kQ8vN4xL7pR1sT6uW3yB5cD8eF0"

export const signupExample = {
	fullName: userName,
	email: userEmail,
	password: userPassword,
	passwordConfirmation: userPassword,
}

export const loginExample = {
	email: userEmail,
	password: userPassword,
}

export const authenticatedUserExample = {
	id: 1,
	fullName: userName,
	email: userEmail,
	createdAt: userTimestamp,
	updatedAt: userTimestamp,
	initials: userInitials,
}

export const authSuccessExample = {
	user: authenticatedUserExample,
	token: accessToken,
}

export const signupSuccessExample = {
	user: authenticatedUserExample,
}

export const invalidCredentialsExample = {
	message: "Invalid credentials",
}

export const logoutSuccessExample = {
	message: "Logged out successfully",
}
