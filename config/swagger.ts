// for AdonisJS v6
import path from "node:path"
import url from "node:url"

import packageJson from "../package.json" with { type: "json" }

const { description, name, version } = packageJson

export default {
	// path: __dirname + "/../", for AdonisJS v5
	path: path.dirname(url.fileURLToPath(import.meta.url)) + "/../", // for AdonisJS v6
	title: name, // use info instead
	version: version, // use info instead
	description: description, // use info instead
	tagIndex: 2,
	// productionEnv: "production", // optional
	info: {
		title: name,
		version: version,
		description: description,
	},
	snakeCase: true,

	debug: false, // set to true, to get some useful debug output
	ignore: ["/swagger", "/docs"],
	preferredPutPatch: "PUT", // if PUT/PATCH are provided for the same route, prefer PUT
	common: {
		parameters: {}, // OpenAPI conform parameters that are commonly used
		headers: {}, // OpenAPI conform headers that are commonly used
	},
	securitySchemes: {
		BearerAuth: {
			type: "http",
			scheme: "bearer",
			bearerFormat: "JWT",
		},
	}, // optional
	authMiddlewares: ["auth", "auth:api"], // optional
	defaultSecurityScheme: "BearerAuth", // optional
	persistAuthorization: true, // persist authorization between reloads on the swagger page
	showFullPath: false, // the path displayed after endpoint summary
}
