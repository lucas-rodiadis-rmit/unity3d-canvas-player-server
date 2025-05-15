import fs from "fs";
import Path from "path";

export const STORAGE_DIR = Path.join(
	process.cwd(),
	"storage"
);

export const UNITY_PROJECTS_DIR = Path.join(
	STORAGE_DIR,
	"unity_projects"
);

export const RESOURCES_DIR = Path.join(
	__dirname,
	"resources"
);

export const PUBLIC_DIR = resourcePath("public");

export function loadResource(
	filepath: string
): string | null {
	try {
		const path = Path.join(RESOURCES_DIR, filepath);

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
	return Path.join(STORAGE_DIR, path);
}

export function resourcePath(path: string): string {
	return Path.join(RESOURCES_DIR, path);
}

export function publicPath(path: string): string {
	return Path.join(PUBLIC_DIR, path);
}
