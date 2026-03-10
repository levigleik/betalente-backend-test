const timestamp = "2026-03-09T10:20:00.000Z"

export const clientExample = {
	id: 1,
	name: "tester",
	email: "tester@email.com",
	createdAt: timestamp,
	updatedAt: timestamp,
}

export const clientListExample = {
	data: [
		clientExample,
		{
			id: 2,
			name: "João da Silva",
			email: "joao.silva@betalent.com",
			createdAt: timestamp,
			updatedAt: timestamp,
		},
	],
}
