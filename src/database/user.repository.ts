import { UnityProject, UnityProjectFile } from "../types";
import { DB } from "./internals";

const UNITY_PROJECT_TABLE = "unity_project";
const UNITY_PROJECT_FILE_TABLE = "unity_project_file";

export function getUnityProject(
	project_id: string
): UnityProject | null {
	const project: any = DB.prepare(
		`SELECT * FROM ${UNITY_PROJECT_TABLE} p WHERE p.project_id = ?`
	).get(project_id);

	if (!project) return null;

	return {
		project_id: project.project_id,
		user_id: project.user_id,

		uploaded: project.uploaded,
		name: project.display_name,
		root_filepath: project.root_filepath
	};
}

export function getFilesForProject(
	project_id: string
): UnityProjectFile[] | null {
	try {
		const filesOriginal = DB.prepare(
			`SELECT * FROM ${UNITY_PROJECT_FILE_TABLE} f WHERE f.project_id = ?`
		).all(project_id);

		if (filesOriginal === null) {
			return null;
		}

		return filesOriginal.map((row: any) => ({
			project_id: row.project_id,
			filepath: row.relative_filepath,
			filesize: row.filesize,
			uploaded: row.uploaded
		}));
	} catch (error) {
		console.error();
	}
	return null;
}
