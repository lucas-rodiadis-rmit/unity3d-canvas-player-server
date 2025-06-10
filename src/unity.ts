import appConfig from "./appConfig";
import { unityappController } from "./database";
import unityappRepository from "./database/unityapp.repository";

import {
	UnityAppConfig,
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

export function unityAppConfigFrom(
	app: UnityApp | null
): UnityAppConfig | null {
	if (app === null) return null;
	const buildUrl =
		appConfig.domainUrl +
		`/data/project/${app.id}/Build`;

	const playerOptions: UnityPlayerOptions | null =
		unityappController.getProjectPlayerOptions(app.id);
	if (playerOptions === null) {
		throw Error(
			`Player options is null for non null app ${app.id}.`
		);
	}

	const files = unityappRepository.getFilesForProject(
		app.id
	);
	if (files.status !== "SUCCESS") {
		throw Error(
			`Unable to get files for project ${app.id}`
		);
	}

	const config: UnityAppConfig = {
		id: app.id,
		name: app.name,

		playerOptions,
		instanceOptions: {
			buildUrl: buildUrl,
			dataUrl: buildUrl + "/buildweb.data.gz",
			frameworkUrl:
				buildUrl + "/buildweb.framework.js.gz",
			codeUrl: buildUrl + "/buildweb.wasm.gz",
			streamingAssetsUrl: "StreamingAssets",
			companyName: "RMIT",
			productName: "Nursing XR",
			productVersion: "1",
			matchWebGLToCanvasSize: false
		}
	};

	return config;
}
