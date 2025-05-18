export interface UnityAppConfig {
	id: string;

	buildUrl: string;
}

export interface CreateEmbedPayload {
	token: string;
	project_id: string;

	/* OTHER OPTIONS CAN BE ADDED HERE */
	// allow_fullscreen: boolean;
}

export function isCreateEmbedPayload(
	body: any
): body is CreateEmbedPayload {
	return (
		typeof body === "object" &&
		// Check token
		"token" in body &&
		typeof body.token === "string" &&
		// Check p_id
		"project_id" in body &&
		typeof body.project_id === "string"
	);
}
