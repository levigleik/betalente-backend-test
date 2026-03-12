import Gateway from "#models/gateway"
import Product from "#models/product"
import User from "#models/user"

let uniqueCounter = 0

function nextEmail(prefix: string) {
	uniqueCounter += 1
	return `${prefix}-${uniqueCounter}@example.com`
}

export function makePurchasePayload(
	products: Array<{ id: number; quantity: number }>,
	overrides: Partial<{
		name: string
		email: string
		cardNumber: string
		cvv: string
	}> = {},
) {
	return {
		name: overrides.name ?? "Purchase User",
		email: overrides.email ?? nextEmail("purchase"),
		products,
		cardNumber: overrides.cardNumber ?? "4111111111111111",
		cvv: overrides.cvv ?? "123",
	}
}

export async function createAdminUser(
	overrides: Partial<{
		fullName: string | null
		email: string
		password: string
	}> = {},
) {
	return User.create({
		fullName: overrides.fullName ?? "Admin User",
		email: overrides.email ?? nextEmail("admin"),
		password: overrides.password ?? "secretpassword",
		role: "ADMIN",
	})
}

export async function createRegularUser(
	overrides: Partial<{
		fullName: string | null
		email: string
		password: string
	}> = {},
) {
	return User.create({
		fullName: overrides.fullName ?? "Regular User",
		email: overrides.email ?? nextEmail("user"),
		password: overrides.password ?? "secretpassword",
		role: "USER",
	})
}

export async function seedDefaultGateways() {
	return Gateway.createMany([
		{ name: "gateway_1", priority: 1, isActive: true },
		{ name: "gateway_2", priority: 2, isActive: true },
	])
}

export async function createProducts() {
	return Product.createMany([
		{ name: "Product A", amount: 100 },
		{ name: "Product B", amount: 250 },
		{ name: "Product C", amount: 400 },
	])
}
