export interface UnityAppConfig {
	id: string;

	buildUrl: string;
}

export interface UnityApp {
	id: string;
	name: string;
	uploaded: Date;

	owner: Instructor;
	files: UnityProjectFile[];
}

export type UserType = "INSTRUCTOR" | "STUDENT";

export interface User {
	user_id: string;
	type: UserType;
}

export interface Student extends User {
	type: "STUDENT";
}

export interface Instructor extends User {
	type: "INSTRUCTOR";
	projects: UnityProject[];
}

export interface UnityProject {
	project_id: string;
	user_id: string;

	uploaded: Date;
	name: string;
	root_filepath: string;
}

export interface UnityProjectFile {
	project_id: string;
	filepath: "";
	filesize: number;
	uploaded: Date;
}

export interface CreateEmbedPayload {
	token: string;

	project_id: string;
	presentation_type: "frame" | "iframe";
	width?: number;
	height?: number;

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
		typeof body.project_id === "string" &&
		// Check presentation_type
		["frame", "iframe"].includes(
			body.presentation_type
		) &&
		// Check width and height
		["undefined", "number"].includes(
			typeof body.width
		) &&
		["undefined", "number"].includes(typeof body.height)
	);


