import vine from "@vinejs/vine"

/**
 * Validator to use when updating a gateway priority
 */
export const updateGatewayPriorityValidator = vine.create({
	priority: vine.number(),
})
