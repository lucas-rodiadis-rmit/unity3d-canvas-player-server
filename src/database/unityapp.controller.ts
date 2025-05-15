import Path from "path";

import { UNITY_PROJECTS_FOLDER } from "../constants";
import { UnityAppConfig } from "../types";

export function getUnityAppConfig(
	id: string
): UnityAppConfig | null {
	if (id === "test123456") {
		const clinicSimPath = Path.join(
			UNITY_PROJECTS_FOLDER,
			"test123456",
			"Build"
		);

		const clinicSim: UnityAppConfig = {
			id: "test123456",
			buildUrl: clinicSimPath
		};

		return clinicSim;
	}

	return null;
}
