import { operationOverrides } from "./operations/index.js";
import { schemaOverrides } from "./schemas/index.js";

function applySchemaOverrides(spec: any) {
	const schemas = spec?.components?.schemas;

	if (!schemas) {
		return;
	}

	for (const [schemaName, override] of Object.entries(schemaOverrides)) {
		const schema = schemas[schemaName];

		if (!schema) {
			continue;
		}

		if (override.example) {
			schema.example = override.example;
		}

		for (const property of Object.values(schema.properties ?? {})) {
			if (property && typeof property === "object" && "example" in property) {
				delete property.example;
			}
		}
	}
}

function applyOperationOverrides(spec: any) {
	const paths = spec?.paths;

	if (!paths) {
		return;
	}

	for (const [pathName, methods] of Object.entries(operationOverrides)) {
		const pathItem = paths[pathName];

		if (!pathItem) {
			continue;
		}

		for (const [method, override] of Object.entries(methods)) {
			const operation = pathItem[method];

			if (!operation) {
				continue;
			}

			const requestContent =
				operation.requestBody?.content?.["application/json"];
			if (requestContent && override.requestExample !== undefined) {
				requestContent.example = override.requestExample;
			}

			for (const [status, example] of Object.entries(
				override.responses ?? {},
			)) {
				const responseContent =
					operation.responses?.[status]?.content?.["application/json"];

				if (responseContent) {
					responseContent.example = example;
				}
			}
		}
	}
}

export function applySwaggerExamples(spec: any) {
	applySchemaOverrides(spec);
	applyOperationOverrides(spec);

	return spec;
}
