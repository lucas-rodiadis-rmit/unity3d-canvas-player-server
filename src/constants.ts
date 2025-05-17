import fs from "fs";
import Path from "path";

import appConfig from "./appConfig";

export function loadResource(
	filepath: string
): string | null {
	try {
		const path = Path.join(
			appConfig.resourcesDir,
			filepath
		);

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
	return Path.join(appConfig.storageDir, path);
}

export function resourcePath(path: string): string {
	return Path.join(appConfig.resourcesDir, path);
}

export function publicPath(path: string): string {
	return Path.join(resourcePath("public"), path);
}
