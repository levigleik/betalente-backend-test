/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from "@adonisjs/core/services/router"
import swagger from "#config/swagger"
import {
	generateSwaggerSpec,
	readSwaggerSpec,
	readSwaggerUiAsset,
	renderSwaggerUiHtml,
} from "#config/swagger_util"
import { controllers } from "#generated/controllers"
import { middleware } from "#start/kernel"

router.group(() => {
	// Login/Logout
	router
		.post("login", [controllers.AccessToken, "store"])
		.prefix("v1/auth")
		.as("auth.login")
	router
		.group(() => {
			router
				.post("logout", [controllers.AccessToken, "destroy"])
				.as("auth.logout")
		})
		.prefix("v1/auth")
		.use(middleware.auth())

	// Purchases (public)
	router.post("purchase", [controllers.Purchases, "store"]).prefix("v1")

	// Private
	router
		.group(() => {
			router.get("profile", [controllers.Profile, "show"])

			// Users
			router
				.group(() => {
					router
						.get("/", [controllers.Users, "index"])
						.use(middleware.role({ roles: ["ADMIN"] }))
					router
						.get("/:id", [controllers.Users, "show"])
						.use(middleware.role({ roles: ["ADMIN"] }))
					router
						.post("/", [controllers.Users, "store"])
						.use(middleware.role({ roles: ["ADMIN"] }))
					router
						.put("/:id", [controllers.Users, "update"])
						.use(middleware.role({ roles: ["ADMIN", "USER"] }))
					router
						.delete("/:id", [controllers.Users, "destroy"])
						.use(middleware.role({ roles: ["ADMIN"] }))
				})
				.prefix("users")

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
				.use(middleware.role({ roles: ["ADMIN"] }))
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

router.get("/", async ({ response }) => {
	return response.redirect("/docs")
})

router.get("/swagger", async () => {
	if (process.env.NODE_ENV === swagger.productionEnv) {
		return readSwaggerSpec()
	}

	return generateSwaggerSpec()
})

router.get("/docs", async () => {
	return renderSwaggerUiHtml("/swagger")
})

router.get("/docs/assets/:file", async ({ params, response }) => {
	const asset = readSwaggerUiAsset(params.file)

	if (!asset) {
		return response.notFound({ message: "Asset not found" })
	}

	response.header("content-type", asset.contentType)
	return asset.body
})
