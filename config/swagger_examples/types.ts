export type SchemaOverride = {
	example?: unknown;
};

export type OperationOverride = {
	requestExample?: unknown;
	responses?: Record<number, unknown>;
};
