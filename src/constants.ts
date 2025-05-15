import fs from "fs";
import Path from "path";

export const STORAGE_FOLDER = Path.join(
	process.cwd(),
	"storage"
);

export const UNITY_PROJECTS_FOLDER = Path.join(
	STORAGE_FOLDER,
	"unity_projects"
);

export const RESOURCES_FOLDER = Path.join(
	process.cwd(),
	"resources"
);

export function loadResource(
	filepath: string
): string | null {
	try {
		const path = Path.join(RESOURCES_FOLDER, filepath);

		const resource: string = fs.readFileSync(
			path,
			"utf-8"
		);

		return resource;
	} catch (error) {
		console.error("An error occured when reading");
	}
	return null;
}

export function storagePath(path: string): string {
	return Path.join(STORAGE_FOLDER, path);
}
