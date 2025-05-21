import { initialiseDb } from "./internals";
import seed from "./seeding";

export { default as unityappController } from "./unityapp.controller";
export { default as userController } from "./user.controller";

export function initDatabase(
	migrate: boolean = true,
	seedDb: boolean = false
): boolean {
	try {
		if (!initialiseDb(migrate)) {
			return false;
		}

		if (seedDb) {
			return seed();
		}

		return true;
	} catch (error) {
		console.error(
			"Error initialising the database:\n",
			error
		);
		return false;
	}
}
