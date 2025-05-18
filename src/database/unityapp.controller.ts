import appConfig from "../appConfig";

import { UnityAppConfig } from "../types";

export function getUnityAppConfig(
	id: string
): UnityAppConfig | null {
	/*
	const app: UnityApp | null = getUnityApp(id);

	if (app === null) {
		return null;
	}
	*/

	if (id === "test123456") {
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

/*
export function getUnityApp(
	project_id: string
): UnityApp | null {
	const project = getUnityProject(project_id);
	if (project == null) return null;

	const files: UnityProjectFile[] | null =
		getFilesForProject(project_id);
	if (files === null) return null;

	const instructor: Instructor = getInstructor(
		project.user_id
	);

	return {
		id: project_id,
		name: project.name,

		owner: files
	};
}
*/
