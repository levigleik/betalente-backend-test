import vine from '@vinejs/vine'

/**
 * Validator to use when creating a product
 */
export const createProductValidator = vine.create({
  name: vine.string().trim().minLength(1).maxLength(255),
  amount: vine.number().min(0),
})

/**
 * Validator to use when updating a product
 */
export const updateProductValidator = vine.create({
  name: vine.string().trim().minLength(1).maxLength(255).optional(),
  amount: vine.number().min(0).optional(),
})
