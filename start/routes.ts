/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import swagger from "#config/swagger"
import { controllers } from "#generated/controllers"
import { middleware } from "#start/kernel"
import router from "@adonisjs/core/services/router"
import AutoSwagger from "adonis-autoswagger"
import { applySwaggerExamples } from "../config/swagger_examples.ts"

router.group(() => {
	// Public
	router
		.group(() => {
			router.post("login", [controllers.AccessToken, "store"])
			router.post("signup", [controllers.NewAccount, "store"])

			// Private
			router
				.group(() => {
					router.post("logout", [controllers.AccessToken, "destroy"])
				})
				.use(middleware.auth())
		})
		.prefix("v1/auth")
		.as("auth")

	// Purchases (public)
	router
		.post("purchase", [controllers.Purchases, "store"])
		.prefix("v1/purchases")

	// Private
	router
		.group(() => {
			// Transactions
			router
				.group(() => {
					router.get("/", [controllers.Transactions, "index"])
					router.get("/:id", [controllers.Transactions, "show"])
					router.post("/:id/refund", [controllers.Transactions, "refund"])
				})
				.prefix("transactions")

			// Clients
			router
				.group(() => {
					router.get("/", [controllers.Clients, "index"])
					router.get("/:id", [controllers.Clients, "show"])
				})
				.prefix("clients")

			// Products
			router
				.group(() => {
					router.get("/", [controllers.Products, "index"])
					router.get("/:id", [controllers.Products, "show"])
					router.post("/", [controllers.Products, "store"])
					router.put("/:id", [controllers.Products, "update"])
					router.delete("/:id", [controllers.Products, "destroy"])
				})
				.prefix("products")

			// Gateways
			router
				.group(() => {
					router.get("/", [controllers.Gateways, "index"])
					router.patch("/:id/toggle", [controllers.Gateways, "toggle"])
					router.patch("/:id/priority", [
						controllers.Gateways,
						"updatePriority",
					])
				})
				.prefix("gateways")
		})
		.prefix("v1")
		.use(middleware.auth())
})

router.get("/swagger", async () => {
	const spec = await AutoSwagger.default.json(router.toJSON(), swagger)

	return AutoSwagger.default.jsonToYaml(applySwaggerExamples(spec))
})

// Renders Swagger-UI and passes YAML-output of /swagger
router.get("/docs", async () => {
	return AutoSwagger.default.ui("/swagger", swagger)
})
