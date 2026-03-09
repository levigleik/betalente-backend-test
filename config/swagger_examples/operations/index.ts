import { authOperationOverrides } from "./auth.ts";
import type { OperationOverride } from "../types.ts";

export const operationOverrides: Record<
	string,
	Record<string, OperationOverride>
> = {
	...authOperationOverrides,
};
