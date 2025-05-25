export interface CreateUnityAppPayload {
	name: string;

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

// Based on server config
export interface UnityAppConfig {
	id: string;
	name: string;

	buildUrl: string;
}

export interface AddUnityProjectFilesPayload {
	projectId: string;
	files: File[];
}
