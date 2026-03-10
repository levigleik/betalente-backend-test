const timestamp = "2026-03-09T10:00:00.000Z"

export const gatewayOneExample = {
	id: 1,
	name: "Gateway 1",
	isActive: true,
	priority: 1,
	createdAt: timestamp,
	updatedAt: timestamp,
}

export const gatewayTwoExample = {
	id: 2,
	name: "Gateway 2",
	isActive: true,
	priority: 2,
	createdAt: timestamp,
	updatedAt: timestamp,
}

export const gatewayListExample = {
	data: [gatewayOneExample, gatewayTwoExample],
}

export const gatewayToggleResponseExample = {
	message: "Gateway atualizado com sucesso",
	data: { ...gatewayOneExample, isActive: false },
}

export const gatewayPriorityResponseExample = {
	message: "Prioridade atualizada com sucesso",
	data: { ...gatewayOneExample, priority: 2 },
}

export const updateGatewayPriorityExample = {
	priority: 2,
}
