export interface CreateUnityAppPayload {
	name: string;
	playerOptions: UnityPlayerOptions;
}

export interface UnityPlayerOptions {
	// Extents options
	embedWidth?: number;
	embedHeight?: number;

	// Control options
	allowResizing: boolean;
	allowFullscreen: boolean;
	allowReloading: boolean;

	// Analytic options
	showFPS: boolean;
}

export interface UnityInstanceOptions {
	buildUrl: string;
	loaderUrl: string; // buildUrl + /buildweb.loader.js
	dataUrl: string; // buildUrl + /buildweb.data.gz
	frameworkUrl: string; // buildUrl + /buildweb.framework.js.gz
	codeUrl: string; // buildUrl = /buildweb.wasm.gz
	streamingAssetsUrl: string; // StreamingAssets
	companyName: string; // eg. "RMIT"
	productName: string; // eg. "Nursing XR",
	productVersion: string; // eg. "1",
	matchWebGLToCanvasSize: false;
}

export interface PartialUnityAppConfig {
	id: string;
	name: string;
}

// Based on server config
export interface UnityAppConfig
	extends PartialUnityAppConfig {
	playerOptions: UnityPlayerOptions;
	instanceOptions: UnityInstanceOptions;
}

export interface AddUnityProjectFilesPayload {
	projectId: string;
	files: File[];
}
