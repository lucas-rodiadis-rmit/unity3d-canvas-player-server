import appConfig from "./appConfig";
import { unityappController } from "./database";
import unityappRepository from "./database/unityapp.repository";

import {
	PartialUnityAppConfig,
	UnityAppConfig,
	UnityInstanceOptions,
	UnityPlayerOptions
} from "./shared/types/types";
import { Instructor } from "./types";

export interface UnityApp {
	id: string;
	name: string;
	uploaded: Date;

	owner: Instructor;
	files: UnityProjectFile[];
}

export interface UnityProjectFile {
	project_id: string;
	filepath: string; // Relative filepath to root
	filesize: number;
	uploaded: Date;
}

export interface UnityProject {
	project_id: string;
	user_id: string;

	uploaded: Date;
	name: string;
	root_filepath: string;

	playerOptions: UnityPlayerOptions;
}

export function partialUnityAppConfigFrom(
	app: UnityApp | null
): PartialUnityAppConfig | null {
	if (!app) return null;

	return { id: app.id, name: app.name };
}

export function unityAppConfigFrom(
	app: UnityApp | null
): UnityAppConfig | null {
	if (app === null) {
		console.error(
			"Attempted to get app config for empty app."
		);
		return null;
	}
	const baseUrl =
		appConfig.domainUrl + `/data/project/${app.id}/`;
	const buildUrl = baseUrl + `Build`;

	const playerOptions: UnityPlayerOptions | null =
		unityappController.getProjectPlayerOptions(app.id);
	if (playerOptions === null) {
		console.log(
			`Player options is null for non null app ${app.id}.`
		);
		return null;
	}

	const files = unityappRepository.getFilesForProject(
		app.id
	);
	if (files.status !== "SUCCESS") {
		console.log(
			`Unable to get files for project ${app.id}`
		);

		return null;
	}

	const instanceOptions: UnityInstanceOptions = {
		buildUrl,
		loaderUrl: "",
		dataUrl: "",
		frameworkUrl: "",
		codeUrl: "",
		streamingAssetsUrl: "",
		companyName: "",
		productName: "",
		productVersion: "",
		matchWebGLToCanvasSize: false
	};

	// Keyname, regex match
	const checks: Array<
		[keyof UnityInstanceOptions, RegExp]
	> = [
		["loaderUrl", /.*\.loader.js(.gz)?/],
		["dataUrl", /.*\.data(.gz)?/],
		["frameworkUrl", /.*\.framework.js(.gz)?/],
		["codeUrl", /.*\.wasm(.gz)?/]
	];

	for (const file of files.data) {
		for (const [key, regex] of checks) {
			// If the filepath matches the regex
			if (regex.test(file.filepath)) {
				// Update instanceOptions
				Object.assign(instanceOptions, {
					[key]: baseUrl + file.filepath
				});
				break;
			}
		}
	}

	// If any fields are missing, return null
	if (
		!checks.every(
			([key, _]) => instanceOptions[key] !== ""
		)
	) {
		console.log(
			`Not all instance options exist for app ${app.id}`
		);
		return null;
	}

	const config: UnityAppConfig = {
		id: app.id,
		name: app.name,

		playerOptions,
		instanceOptions
	};

	return config;
}
