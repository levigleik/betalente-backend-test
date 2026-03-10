import type { HttpContext } from "@adonisjs/core/http"
import Product from "#models/product"

export default class ProductsController {
	async index({ response }: HttpContext) {
		const products = await Product.all()

		return response.ok({
			data: products,
		})
	}

	async show({ params, response }: HttpContext) {
		const product = await Product.findOrFail(params.id)

		return response.ok({
			data: product,
		})
	}

	async store({ request, response }: HttpContext) {
		const payload = request.only(["name", "amount"])

		const product = await Product.create({
			name: payload.name,
			amount: payload.amount,
		})

		return response.created({
			message: "Produto criado com sucesso",
			data: product,
		})
	}

	async update({ params, request, response }: HttpContext) {
		const product = await Product.findOrFail(params.id)
		const payload = request.only(["name", "amount"])

		product.merge(payload)
		await product.save()

		return response.ok({
			message: "Produto atualizado com sucesso",
			data: product,
		})
	}

	async destroy({ params, response }: HttpContext) {
		const product = await Product.findOrFail(params.id)

		await product.delete()

		return response.ok({
			message: "Produto removido com sucesso",
		})
	}
}
