import { UnityAppConfig } from "../types";

export function getUnityAppConfig(
	id: string
): UnityAppConfig | null {
	if (id === "test123456") {
		const clinicSimPath = "/data/test123456/Build";
		const clinicSim: UnityAppConfig = {
			id: "test123456",
			buildUrl: clinicSimPath
		};

		return clinicSim;
	}

	return null;
}
