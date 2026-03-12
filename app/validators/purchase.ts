import vine from "@vinejs/vine"

/**
 * Validator to use when creating a purchase
 */
export const createPurchaseValidator = vine.create({
	name: vine.string().trim().minLength(1),
	email: vine.string().email(),
	products: vine
		.array(
			vine.object({
				id: vine.number().exists({
					table: "products",
					column: "id",
				}),
				quantity: vine.number().min(1),
			}),
		)
		.minLength(1),
	cardNumber: vine.string().trim().minLength(13).maxLength(19),
	cvv: vine.string().trim().minLength(3).maxLength(4),
})
