import { UnityProject, UnityProjectFile } from "../unity";
import { DB } from "./internals";
import { DBGetManyResult } from "./types";

const UNITY_PROJECT_TABLE = "unity_project";
const UNITY_PROJECT_FILE_TABLE = "unity_project_file";

function getUnityProject(
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

function getFilesForProject(
	project_id: string
): DBGetManyResult<UnityProjectFile> {
	try {
		const filesOriginal = DB.prepare(
			`SELECT * FROM ${UNITY_PROJECT_FILE_TABLE} f WHERE f.project_id = ?`
		).all(project_id);

		if (filesOriginal === null) {
			return {
				status: "ERROR",
				message: "List of files returned as null."
			};
		}

		const mapped = filesOriginal.map((row: any) => ({
			project_id: row.project_id,
			filepath: row.relative_filepath,
			filesize: row.filesize,
			uploaded: row.uploaded
		}));

		return { status: "SUCCESS", data: mapped };
	} catch (error) {
		return {
			status: "ERROR",
			message: String(error)
		};
	}
}

export default { getUnityProject, getFilesForProject };
