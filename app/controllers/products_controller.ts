import type { HttpContext } from "@adonisjs/core/http"
import Product from "#models/product"

export default class ProductsController {
	/**
	 * @index
	 * @summary Listar produtos
	 * @responseBody 200 - <ProductListResponseDto>
	 */
	async index({ response }: HttpContext) {
		const products = await Product.all()

		return response.ok({
			data: products,
		})
	}

	/**
	 * @show
	 * @summary Obter produto
	 * @responseBody 200 - <ProductDetailResponseDto>
	 */
	async show({ params, response }: HttpContext) {
		const product = await Product.findOrFail(params.id)

		return response.ok({
			data: product,
		})
	}

	/**
	 * @store
	 * @summary Criar produto
	 * @requestBody <CreateProductDto>
	 * @responseBody 201 - <ProductMessageDataResponseDto>
	 */
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

	/**
	 * @update
	 * @summary Atualizar produto
	 * @requestBody <CreateProductDto>
	 * @responseBody 200 - <ProductMessageDataResponseDto>
	 */
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

	/**
	 * @destroy
	 * @summary Remover produto
	 * @responseBody 200 - <MessageResponseDto>
	 */
	async destroy({ params, response }: HttpContext) {
		const product = await Product.findOrFail(params.id)

		await product.delete()

		return response.ok({
			message: "Produto removido com sucesso",
		})
	}
}
