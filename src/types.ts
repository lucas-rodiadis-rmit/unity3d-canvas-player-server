import { UnityProject, UnityProjectFile } from "./unity";

export type UserType = "INSTRUCTOR" | "STUDENT";

export interface User {
	userId: string;
	type: UserType;
}

export interface Student extends User {
	type: "STUDENT";
}

export interface Instructor extends User {
	type: "INSTRUCTOR";
	projects?: UnityProject[];
}

function checkPayload(
	obj: any,
	members: Readonly<Array<[string, string, boolean]>>
) {
	if (
		typeof obj !== "object" ||
		obj === undefined ||
		obj === null
	)
		return false;

	for (const [key, type, required] of members) {
		if (!(key in obj)) {
			console.debug(
				`Missing key "${key}" required in ${members.map((k) => k[0])}`
			);

			console.debug("Object tested: ", obj);

			return false;
		}

		const validTypes = [type];
		if (!required) validTypes.push("undefined");

		if (!validTypes.includes(typeof obj[key])) {
			console.debug(
				`Type mismatch: .${key} is type ${typeof obj[key]}, but one of ${validTypes} was expected.`
			);
			return false;
		}
	}

	return true;
}

export type CreateUnityProjectFilePayload = Omit<
	UnityProjectFile,
	"project_id" | "uploaded"
>;

export function isCreateUnityProjectFilePayload(
	obj: any
): obj is CreateUnityProjectFilePayload {
	const keys: Array<[string, string, boolean]> = [
		["filepath", "string", true],
		["filesize", "number", true]
	] as const;

	return checkPayload(obj, keys);
}

export interface CreateUnityAppPayload {
	name: string;

	// Extents options
	embedWidth?: number;
	embedHeight?: number;

	// Control options
	allowResizing: boolean;
	allowFullscreen: boolean;
	allowReloading: boolean;

	files: Array<CreateUnityProjectFilePayload>;

	// Analytic options
	showFPS: boolean;
}

export function isCreateUnityAppPayload(
	body: any
): body is CreateUnityAppPayload {
	const keys: Array<[string, string, boolean]> = [
		["name", "string", true],
		["allowResizing", "boolean", true],
		["allowFullscreen", "boolean", true],
		["allowReloading", "boolean", true],
		["showFPS", "boolean", true],
		["embedWidth", "number", false],
		["embedHeight", "number", false]
	] as const;

	if (!body.files || !Array.isArray(body.files)) {
		console.debug("files is not a valid array.");
		return false;
	}

	for (const file of body.files) {
		if (!isCreateUnityProjectFilePayload(file)) {
			console.debug(
				"Invalid CreateUnityProjectFilePayload found: ",
				file
			);
			return false;
		}
	}

	return checkPayload(body, keys);
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
	const keys: Array<[string, string, boolean]> = [
		["token", "string", true],
		["project_id", "string", true],
		["presentation_type", "string", true],
		["width", "boolean", false],
		["height", "boolean", false]
	] as const;

	return (
		checkPayload(body, keys) &&
		["frame", "iframe"].includes(body.presentation_type)
	);
}
