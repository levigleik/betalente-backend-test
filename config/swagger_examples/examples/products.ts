const timestamp = "2026-03-09T10:15:00.000Z"

export const productExample = {
	id: 1,
	name: "Plano Básico",
	amount: 1000,
	createdAt: timestamp,
	updatedAt: timestamp,
}

export const productListExample = {
	data: [
		productExample,
		{
			id: 2,
			name: "Plano Pro",
			amount: 2500,
			createdAt: timestamp,
			updatedAt: timestamp,
		},
	],
}

export const createProductExample = {
	name: "Plano Básico",
	amount: 1000,
}

export const productCreateResponseExample = {
	message: "Produto criado com sucesso",
	data: productExample,
}

export const productUpdateResponseExample = {
	message: "Produto atualizado com sucesso",
	data: { ...productExample, name: "Plano Básico Plus", amount: 1500 },
}

export const productDeleteResponseExample = {
	message: "Produto removido com sucesso",
}
