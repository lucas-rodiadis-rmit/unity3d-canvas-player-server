import { CreateUnityAppPayload } from "../shared/types";
import { CreateUnityProjectFilePayload } from "../types";
import { UnityApp } from "../unity";
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

	if (instructor.status !== "SUCCESS") {
		console.debug(
			`Can't get Unity app ${project_id} because no instructor count be found from the user_id.`
		);
		return null;
	}

	const files =
		unityappRepository.getFilesForProject(project_id);
	if (files.status === "ERROR") {
		throw Error(files.message);
	}

	return {
		id: project_id,
		name: project.data.name,

		uploaded: project.data.uploaded,

		owner: instructor.data,
		files: files.data
	};
}

function getAllUnityApps(): UnityApp[] {
	const projects =
		unityappRepository.getAllUnityProjects();

	if (projects.status !== "SUCCESS") return [];

	return projects.data
		.map((project) => {
			const instructor = userRepo.getInstructor(
				project.user_id
			);

			if (instructor.status !== "SUCCESS")
				return null;

			const files =
				unityappRepository.getFilesForProject(
					project.project_id
				);
			if (files.status === "ERROR") {
				throw Error(files.message);
			}

			return {
				id: project.project_id,
				name: project.name,

				uploaded: project.uploaded,

				owner: instructor.data,
				files: files.data
			};
		})
		.filter((app) => app !== null);
}

function createUnityApp(
	userId: string, // Instructor
	payload: CreateUnityAppPayload,
	projectId?: string
): UnityApp | null {
	let result = unityappRepository.addUnityProject(
		userId,
		payload.name,
		false, // Disallow upsert
		projectId
	);

	if (result.status !== "SUCCESS") return null;

	// TODO: Use this
	/*
	for (const file of payload.files) {
		if (
			!unityappController.addUnityProjectFile(
				result.data.project_id,
				{
					filepath: file.webkitRelativePath,
					filesize: file.size
				}
			)
		) {
			return null;
		}
	}
	*/

	const newApp = unityappController.getUnityApp(
		result.data.project_id
	);

	console.debug("Created new app: ", newApp);
	return newApp;
}

export default {
	createUnityApp,
	addUnityProjectFile,
	getUnityApp,
	getAllUnityApps
};
