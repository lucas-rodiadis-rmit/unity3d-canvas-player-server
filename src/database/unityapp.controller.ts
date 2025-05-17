import appConfig from "../appConfig";

import { UnityAppConfig } from "../types";

export function getUnityAppConfig(
	id: string
): UnityAppConfig | null {
	if (id === "test123456") {
		const clinicSimPath =
			appConfig.domainUrl +
			"/data/project/test123456/Build";
		const clinicSim: UnityAppConfig = {
			id: "test123456",
			buildUrl: clinicSimPath
		};

		return clinicSim;
	}

	return null;
}
