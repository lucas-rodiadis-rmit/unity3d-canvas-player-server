import appConfig from "./appConfig";
import { Instructor } from "./types";

export interface UnityAppConfig {
	id: string;
	name: string;

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
	filepath: string; // Relative filepath to root
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

	return {
		id: app.id,
		name: app.name,
		buildUrl:
			appConfig.domainUrl +
			`/data/project/${app.id}/Build`
	};
}
