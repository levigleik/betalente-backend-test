import vine from '@vinejs/vine'

/**
 * Validator to use when creating a purchase
 */
export const createPurchaseValidator = vine.create({
  name: vine.string().trim().minLength(1),
  email: vine.string().email(),
  amount: vine.number().positive(),
  cardNumber: vine.string().trim().minLength(13).maxLength(19),
  cvv: vine.string().trim().minLength(3).maxLength(4),
})
