import {
	CreateEmbedPayload,
	CreateUnityProjectFilePayload
} from "../../types";
import { CreateUnityAppPayload } from "./types";

export function checkPayload(
	obj: any,
	members: Readonly<Array<[string, string, boolean]>>
) {
	if (
		typeof obj !== "object" ||
		obj === undefined ||
		obj === null
	) {
		console.debug(
			`Expected a valid object in payload check. Received ${typeof obj} instead.`
		);
		return false;
	}

	for (const [key, type, required] of members) {
		if (required && !(key in obj)) {
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

export function isCreateUnityAppPayload(
	body: any
): body is CreateUnityAppPayload {
	const mainKeys: Array<[string, string, boolean]> = [
		["name", "string", true]
	] as const;

	if (!("playerOptions" in body)) return false;

	const playerKeys: Array<[string, string, boolean]> = [
		["allowResizing", "boolean", true],
		["allowFullscreen", "boolean", true],
		["allowReloading", "boolean", true],
		["showFPS", "boolean", true],
		["embedWidth", "number", false],
		["embedHeight", "number", false]
	] as const;

	return (
		checkPayload(body, mainKeys) &&
		checkPayload(body.playerOptions, playerKeys)
	);
}

export function isCreateUnityProjectFilePayload(
	obj: any
): obj is CreateUnityProjectFilePayload {
	const keys: Array<[string, string, boolean]> = [
		["filepath", "string", true],
		["filesize", "number", true]
	] as const;

	return checkPayload(obj, keys);
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
