import { initialiseDb } from "./internals";
export { getUnityAppConfig } from "./UnityApp";

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
