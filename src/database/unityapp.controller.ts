import { CreateUnityAppPayload } from "../types";
import {
	CreateUnityProjectFilePayload,
	UnityApp
} from "../unity";
import unityappController from "./unityapp.controller";
import unityappRepository from "./unityapp.repository";

import userRepo from "./user.repository";

function addUnityProjectFile(
	// ID of the project the file is being added to
	project_id: string,
	props: CreateUnityProjectFilePayload
): boolean {
	const unityProject =
		unityappRepository.getUnityProject(project_id);

	if (unityProject.status !== "SUCCESS") {
		return false;
	}

	return (
		unityappRepository.addFileToProject(
			unityProject.data.project_id,
			props.filepath,
			props.filesize,
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

function createUnityApp(
	userId: string, // Instructor
	rootFilepath: string,
	payload: CreateUnityAppPayload,
	projectId?: string
): UnityApp | null {
	let result = unityappRepository.addUnityProject(
		userId,
		payload.name,
		rootFilepath,
		false, // Disallow upsert
		projectId
	);

	if (result.status !== "SUCCESS") return null;

	for (const file of payload.files) {
		if (
			!unityappController.addUnityProjectFile(
				result.data.project_id,
				file
			)
		) {
			return null;
		}
	}

	return unityappController.getUnityApp(
		result.data.project_id
	);
}

export default {
	createUnityApp,
	addUnityProjectFile,
	getUnityApp
};
