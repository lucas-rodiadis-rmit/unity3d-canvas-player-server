import { initialiseDb } from "./internals";
export { getUnityAppConfig } from "./unityapp.controller";

export function initDatabase(
	migrate: boolean = true
): boolean {
	try {
		initialiseDb(migrate);
	} catch (error) {
		return false;
	}
	return true;
}
