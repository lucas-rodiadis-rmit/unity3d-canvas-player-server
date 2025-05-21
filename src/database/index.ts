import { initialiseDb } from "./internals";

export { default as unityappController } from "./unityapp.controller";
export { default as userController } from "./user.controller";

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
