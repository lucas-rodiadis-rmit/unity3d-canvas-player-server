import { UnityAppConfig } from "../types";

export function getUnityAppConfig(
	id: string
): UnityAppConfig | null {
	if (id === "test123456") {
		const clinicSim: UnityAppConfig = {
			id: "test123456",
			buildUrl: "/ClinicSim/Build"
		};

		return clinicSim;
	}

	return null;
}
