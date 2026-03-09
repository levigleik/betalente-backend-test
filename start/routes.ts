/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import swagger from "#config/swagger";
import { controllers } from "#generated/controllers";
import { middleware } from "#start/kernel";
import router from "@adonisjs/core/services/router";
import AutoSwagger from "adonis-autoswagger";

router.get("/", () => {
	return { hello: "world" };
});

router
	.group(() => {
		router
			.group(() => {
				router.post("signup", [controllers.NewAccount, "store"]);
				router.post("login", [controllers.AccessToken, "store"]);
				router
					.post("logout", [controllers.AccessToken, "destroy"])
					.use(middleware.auth());
			})
			.prefix("auth")
			.as("auth");

		router
			.group(() => {
				router.get("/profile", [controllers.Profile, "show"]);
			})
			.prefix("account")
			.as("profile")
			.use(middleware.auth());
	})
	.prefix("/api/v1");

// returns swagger in YAML
router.get("/swagger", async () => {
	return AutoSwagger.default.docs(router.toJSON(), swagger);
});

// Renders Swagger-UI and passes YAML-output of /swagger
router.get("/docs", async () => {
	return AutoSwagger.default.ui("/swagger", swagger);
	// return AutoSwagger.default.scalar("/swagger"); to use Scalar instead. If you want, you can pass proxy url as second argument here.
	// return AutoSwagger.default.rapidoc("/swagger", "view"); to use RapiDoc instead (pass "view" default, or "read" to change the render-style)
});
