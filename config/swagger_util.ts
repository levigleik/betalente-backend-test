import fs from "node:fs"
import path from "node:path"
import url from "node:url"

import swaggerJSDoc from "swagger-jsdoc"
import swaggerUiDist from "swagger-ui-dist"
import { stringify as stringifyYaml } from "yaml"
import env from "#start/env"
import packageJson from "../package.json" with { type: "json" }

const projectRoot = path.join(
	path.dirname(url.fileURLToPath(import.meta.url)),
	"..",
)
const swaggerUiPath = swaggerUiDist.getAbsoluteFSPath()

const uiAssetTypes: Record<string, string> = {
	".css": "text/css; charset=utf-8",
	".js": "application/javascript; charset=utf-8",
	".png": "image/png",
}
const appURL = env.get("APP_URL")
export const swaggerConfig = {
	productionEnv: "production",
	specPath: path.join(projectRoot, "swagger.json"),
	specYamlPath: path.join(projectRoot, "swagger.yml"),
	definition: {
		openapi: "3.0.3",
		info: {
			title: packageJson.name,
			version: packageJson.version,
			description: packageJson.description,
		},
		servers: [
			{
				url: appURL ?? "/",
				description: "Current server",
			},
		],
		tags: [
			{ name: "Auth", description: "Autenticação e gestão de sessão" },
			{ name: "Profile", description: "Perfil do usuário autenticado" },
			{ name: "Users", description: "Gestão de usuários" },
			{ name: "Clients", description: "Consulta de clientes" },
			{ name: "Products", description: "Gestão de produtos" },
			{ name: "Gateways", description: "Gestão de gateways de pagamento" },
			{ name: "Purchases", description: "Criação de compras" },
			{
				name: "Transactions",
				description: "Consulta e reembolso de transações",
			},
		],
		components: {
			securitySchemes: {
				BearerAuth: {
					type: "http",
					scheme: "bearer",
					bearerFormat: "JWT",
				},
			},
		},
	},
	apis: [
		path.join(projectRoot, "app/controllers/**/*.ts"),
		path.join(projectRoot, "app/docs/**/*.ts"),
	],
	uiAssetsPath: swaggerUiPath,
	persistAuthorization: true,
}

export function generateSwaggerSpec() {
	return swaggerJSDoc({
		failOnErrors: true,
		definition: swaggerConfig.definition,
		apis: swaggerConfig.apis,
	})
}

export function readSwaggerSpec() {
	return JSON.parse(fs.readFileSync(swaggerConfig.specPath, "utf8"))
}

export function writeSwaggerSpec(spec: object) {
	fs.writeFileSync(swaggerConfig.specPath, JSON.stringify(spec, null, 2))
	fs.writeFileSync(swaggerConfig.specYamlPath, stringifyYaml(spec))
}

export function renderSwaggerUiHtml(specUrl: string) {
	return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${packageJson.name} API Docs</title>
    <link rel="stylesheet" href="/docs/assets/swagger-ui.css" />
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="/docs/assets/swagger-ui-bundle.js"></script>
    <script src="/docs/assets/swagger-ui-standalone-preset.js"></script>
    <script>
      window.onload = () => {
        window.ui = SwaggerUIBundle({
          url: "${specUrl}",
          dom_id: "#swagger-ui",
          presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
          layout: "StandaloneLayout",
          persistAuthorization: ${swaggerConfig.persistAuthorization ? "true" : "false"},
        })
      }
    </script>
  </body>
</html>`
}

export function readSwaggerUiAsset(fileName: string) {
	const safeFileName = path.basename(fileName)
	const assetPath = path.join(swaggerUiPath, safeFileName)

	if (!fs.existsSync(assetPath)) {
		return null
	}

	const extension = path.extname(safeFileName)
	const contentType = uiAssetTypes[extension]

	if (!contentType) {
		return null
	}

	return {
		body: fs.readFileSync(assetPath),
		contentType,
	}
}
