import { UnityApp, UnityProjectFile } from "../unity";
import unityappRepository from "./unityapp.repository";

import userRepo from "./user.repository";

function addUnityProjectFile(
	// ID of the project the file is being added to
	project_id: string,
	// The relative filepath of the file  (eg. Build/buildweb.loader.js)
	filepath: string,
	// The size of the file as an unsigned integer  (eg. 4096 <= 4kb)
	filesize: number
): void {
	// TODO: Implement
}

function getUnityApp(project_id: string): UnityApp | null {
	const project =
		unityappRepository.getUnityProject(project_id);
	if (project == null) return null;

	const instructor = userRepo.getInstructor(
		project.user_id
	);
	if (instructor === null) return null;

	const files: UnityProjectFile[] | null =
		unityappRepository.getFilesForProject(project_id);
	if (files === null) return null;

	return {
		id: project_id,
		name: project.name,

		uploaded: project.uploaded,

		owner: instructor,
		files: files
	};
}

export default {
	addUnityProjectFile,
	getUnityApp
};
