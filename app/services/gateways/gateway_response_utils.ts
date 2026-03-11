export type GatewayPayloadError = {
	message: string
	statusCode?: number
}

function toNonEmptyString(value: unknown): string | null {
	if (typeof value !== "string") {
		return null
	}

	const normalized = value.trim()
	return normalized.length > 0 ? normalized : null
}

export function readGatewayPayloadError(
	payload: any,
): GatewayPayloadError | null {
	if ((payload === null || payload === undefined) || typeof payload !== 'object') {
		return null
	}

	const statusCode = Number(payload.statusCode)
	const hasErrorField =
		payload.error !== undefined &&
		payload.error !== null &&
		String(payload.error).trim() !== ""
	const hasErrorStatus = statusCode !== null && statusCode >= 400

	if (!hasErrorField && !hasErrorStatus) {
		return null
	}

	const explicitError = toNonEmptyString(payload.error)
	const message =
		explicitError ??
		(statusCode
			? `Gateway retornou erro (status ${statusCode})`
			: "Gateway retornou erro")

	return {
		message,
		statusCode: statusCode ?? undefined,
	}
}
