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
import { applySwaggerExamples } from "../config/swagger_examples.ts";

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

router.get("/swagger", async () => {
	const spec = await AutoSwagger.default.json(router.toJSON(), swagger);

	return AutoSwagger.default.jsonToYaml(applySwaggerExamples(spec));
});

// Renders Swagger-UI and passes YAML-output of /swagger
router.get("/docs", async () => {
	return AutoSwagger.default.ui("/swagger", swagger);
});
