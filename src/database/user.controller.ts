import { UnityProjectFile, User } from "../types";
import {
	getFilesForProject,
	getUnityProject
} from "./unityapp.repository";

export function getUser(project_id: string): User | null {
	const project = getUnityProject(project_id);
	if (project == null) return null;

	const files: UnityProjectFile[] | null =
		getFilesForProject(project_id);
	if (files === null) return null;

	return null;

	/*
	const instructor: Instructor = getInstructor(
		project.user_id
	);

	return {
		id: project_id,
		name: project.name,

		owner: files
	};
	*/
}
