import { authSchemaOverrides } from "./auth.ts";
import type { SchemaOverride } from "../types.ts";

export const schemaOverrides: Record<string, SchemaOverride> = {
	...authSchemaOverrides,
};
