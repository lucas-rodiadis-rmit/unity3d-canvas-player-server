import { initialiseDb } from "./internals";
export { getUnityAppConfig } from "./unityapp.controller";

export function initDatabase(
	migrate: boolean = true
): boolean {
	try {
		initialiseDb(migrate);
	} catch (error) {
		console.error(
			"Error initialising the database:\n",
			error
		);
		return false;
	}
	return true;
}
