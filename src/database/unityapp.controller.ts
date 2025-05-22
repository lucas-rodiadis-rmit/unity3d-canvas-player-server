import { UnityApp } from "../unity";
import unityappRepository from "./unityapp.repository";

import userRepo from "./user.repository";

function addUnityProjectFile(
	// ID of the project the file is being added to
	project_id: string,
	// The relative filepath of the file  (eg. Build/buildweb.loader.js)
	relativeFilepath: string,
	// The size of the file as an unsigned integer  (eg. 4096 <= 4kb)
	filesize: number
): boolean {
	const unityProject =
		unityappRepository.getUnityProject(project_id);

	if (unityProject.status !== "SUCCESS") {
		return false;
	}

	return (
		unityappRepository.addFileToProject(
			unityProject.data.project_id,
			relativeFilepath,
			filesize,
			true // Allow Upsert
		).status === "SUCCESS"
	);
}

function getUnityApp(project_id: string): UnityApp | null {
	const project =
		unityappRepository.getUnityProject(project_id);
	if (project.status !== "SUCCESS") {
		console.log(
			`Failed to get Unity project by ID ${project_id}`
		);
		return null;
	}

	const instructor = userRepo.getInstructor(
		project.data.user_id
	);

	if (instructor.status !== "SUCCESS") return null;

	const files =
		unityappRepository.getFilesForProject(project_id);
	if (files.status === "ERROR") {
		throw Error(files.message);
	}

	console.log({
		id: project_id,
		name: project.data.name,

		uploaded: project.data.uploaded,

		owner: instructor.data,
		files: files.data
	});

	return {
		id: project_id,
		name: project.data.name,

		uploaded: project.data.uploaded,

		owner: instructor.data,
		files: files.data
	};
}

export default {
	addUnityProjectFile,
	getUnityApp
};
