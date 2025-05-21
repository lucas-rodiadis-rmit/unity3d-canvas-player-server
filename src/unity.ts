import appConfig from "./appConfig";
import { Instructor } from "./types";

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

export interface UnityProjectFile {
	project_id: string;
	filepath: "";
	filesize: number;
	uploaded: Date;
}

export interface UnityProject {
	project_id: string;
	user_id: string;

	uploaded: Date;
	name: string;
	root_filepath: string;
}

export function unityAppConfigFrom(
	app: UnityApp | null
): UnityAppConfig | null {
	if (app === null) return null;

	// TODO: Implement extracting the app config from the project in the database
	if (app.id === "test123456") {
		const clinicSimPath =
			appConfig.domainUrl +
			"/data/project/test123456/Build";

		const clinicSim: UnityAppConfig = {
			id: "test123456",
			buildUrl: clinicSimPath
		};

		return clinicSim;
	}

	return null;
}
