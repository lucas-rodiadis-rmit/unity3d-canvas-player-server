import { UnityPlayerOptions } from "../shared/types";
import { UnityProject, UnityProjectFile } from "../unity";

import {
	DB,
	DBInternalUnityProject,
	DBInternalUnityProjectFile,
	UNITY_PROJECT_FILE_TABLE,
	UNITY_PROJECT_TABLE
} from "./internals";

import {
	DBCreateResult,
	DBGetManyResult,
	DBGetResult
} from "./types";

import uuid4 from "uuid4";

function deserialiseUnityProject(
	project: DBInternalUnityProject
): UnityProject {
	return {
		project_id: project.project_id,
		user_id: project.user_id,

		uploaded: new Date(project.uploaded),
		name: project.name,
		root_filepath: project.root_filepath,
		playerOptions: {
			embedWidth: project.embed_width,
			embedHeight: project.embed_height,
			allowResizing: project.allow_resizing,
			allowReloading: project.allow_reloading,
			allowFullscreen: project.allow_fullscreen,
			showFPS: project.fps_counter
		}
	};
}

function getUnityProject(
	project_id: string
): DBGetResult<UnityProject> {
	const project = DB.prepare<
		string,
		DBInternalUnityProject
	>(
		`SELECT * FROM ${UNITY_PROJECT_TABLE} p WHERE p.project_id = ?`
	).get(project_id);

	if (!project) {
		console.debug(
			`Get project by ID failed in SQL for project_id ${project_id}`
		);
		return { status: "FAILURE" };
	}

	return {
		status: "SUCCESS",
		data: deserialiseUnityProject(project)
	};
}

function getAllUnityProjects(): DBGetManyResult<UnityProject> {
	const projects = DB.prepare<{}, DBInternalUnityProject>(
		`SELECT * FROM ${UNITY_PROJECT_TABLE};`
	).all({});

	return {
		status: "SUCCESS",
		data: projects.map(deserialiseUnityProject)
	};
}

export function addUnityProject(
	userId: string,
	name: string,
	playerOptions: UnityPlayerOptions,
	allowUpsert?: boolean,
	project_id?: string
): DBCreateResult<UnityProject> {
	const stmt = DB.prepare<
		DBInternalUnityProject,
		DBInternalUnityProject
	>(
		`INSERT INTO ${UNITY_PROJECT_TABLE} (project_id, name, user_id, uploaded, root_filepath, embed_width, embed_height, allow_resizing, allow_fullscreen, allow_reloading, fps_counter)
			VALUES (@project_id, @name, @user_id, @uploaded, @root_filepath, @embed_width, @embed_height, @allow_resizing, @allow_fullscreen, @allow_reloading, @fps_counter)
			${allowUpsert ? "ON CONFLICT(project_id) DO UPDATE SET name = excluded.name, user_id = excluded.user_id, uploaded = excluded.uploaded, root_filepath = excluded.root_filepath" : ""}
		RETURNING *`
	);

	if (!project_id) {
		project_id = uuid4();
	}

	const unityProject = stmt.get({
		user_id: userId,
		name: name,
		uploaded: Date.now(),
		project_id: project_id,
		root_filepath: `${project_id}/`,

		embed_width: playerOptions.embedWidth,
		embed_height: playerOptions.embedHeight,

		allow_resizing: playerOptions.allowResizing,
		allow_fullscreen: playerOptions.allowFullscreen,
		allow_reloading: playerOptions.allowReloading,
		fps_counter: playerOptions.showFPS
	});

	if (!unityProject)
		return {
			status: "ERROR",
			message: "Unknown error."
		};

	return {
		status: "SUCCESS",
		data: deserialiseUnityProject(unityProject)
	};
}

export function addFileToProject(
	project_id: string,
	relativeFilepath: string,
	filesize: number,
	allowUpsert?: boolean
): DBCreateResult<UnityProjectFile> {
	const stmt = DB.prepare<
		DBInternalUnityProjectFile,
		DBInternalUnityProjectFile
	>(
		`INSERT INTO ${UNITY_PROJECT_FILE_TABLE} (project_id, relative_filepath, filesize, uploaded)
			VALUES (@project_id, @relative_filepath, @filesize, @uploaded)
			${allowUpsert ? "ON CONFLICT(project_id, relative_filepath) DO UPDATE SET filesize = excluded.filesize, uploaded = excluded.uploaded" : ""}
		RETURNING *`
	);

	if (!project_id) {
		project_id = uuid4();
	}

	const unityProject = stmt.get({
		project_id: project_id,
		relative_filepath: relativeFilepath,
		filesize: filesize,
		uploaded: Date.now()
	});

	if (!unityProject)
		return {
			status: "ERROR",
			message: "Unknown error."
		};

	return {
		status: "SUCCESS",
		data: {
			project_id: unityProject.project_id,
			filesize: unityProject.filesize,
			filepath: unityProject.relative_filepath,
			uploaded: new Date(unityProject.uploaded)
		}
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

export default {
	getUnityProject,
	getAllUnityProjects,
	addUnityProject,
	getFilesForProject,
	addFileToProject
};
