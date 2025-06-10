import { UnityProject, UnityProjectFile } from "./unity";

export type UserType = "INSTRUCTOR" | "STUDENT";

export interface User {
	userId: string;
	type: UserType;
}

export interface Student extends User {
	type: "STUDENT";
}

export interface Instructor extends User {
	type: "INSTRUCTOR";
	projects?: UnityProject[];
}

export type CreateUnityProjectFilePayload = Omit<
	UnityProjectFile,
	"project_id" | "uploaded"
>;

export interface CreateEmbedPayload {
	token: string;

	project_id: string;
	presentation_type: "frame" | "iframe";
	width?: number;
	height?: number;

	/* OTHER OPTIONS CAN BE ADDED HERE */
	// allow_fullscreen: boolean;
}
