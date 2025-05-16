export interface UnityAppConfig {
	id: string;

	buildUrl: string;
}

export interface UnityApp {
	id: string;
	name: string;
	uploaded: Date;

	owner: Instructor;
	files: UnityProjectFile[];
}

export type UserType = "INSTRUCTOR" | "STUDENT";

export interface User {
	user_id: string;
	type: UserType;
}

export interface Student extends User {
	type: "STUDENT";
}

export interface Instructor extends User {
	type: "INSTRUCTOR";
	projects: UnityProject[];
}

export interface UnityProject {
	project_id: string;
	user_id: string;

	uploaded: Date;
	name: string;
	root_filepath: string;
}

export interface UnityProjectFile {
	project_id: string;
	filepath: "";
	filesize: number;
	uploaded: Date;
}
