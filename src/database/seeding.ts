import { UnityPlayerOptions } from "../shared/types";
import unityappRepository from "./unityapp.repository";
import userRepository from "./user.repository";

function seed(): boolean {
	console.log("Beginning insert of seed data.");

	const seedInstructors = [
		[
			"test_instructor_1",
			"test_instructor_1@email.com"
		],
		["test_instructor_2", "test_instructor_2@email.com"]
	] as const;

	for (const instructor of seedInstructors) {
		console.log(
			`Inserting seed instructor ${instructor[0]} (${instructor[1]})`
		);

		const result = userRepository.addInstructor(
			instructor[0],
			instructor[1],
			true
		);
		if (result.status !== "SUCCESS") {
			console.error("Error inserting the instructor");
			return false;
		}
	}

	const seedProjects: Array<
		[string, string, UnityPlayerOptions, string]
	> = [
		[
			"test_instructor_1",
			"ClinicSim",
			{
				showFPS: true,
				allowFullscreen: true,
				allowResizing: true,
				allowReloading: true
			},
			"test123456"
		]
	];

	for (const project of seedProjects) {
		console.log(
			`Inserting seed project ${project.toString()}`
		);

		const result = unityappRepository.addUnityProject(
			project[0],
			project[1],
			project[2],
			true,
			project[3]
		);

		if (result.status !== "SUCCESS") {
			console.error("Error inserting the instructor");
			return false;
		}
	}

	const seedFiles = [
		"Build/buildweb.data.gz",
		"Build/buildweb.framework.js.gz",
		"Build/buildweb.loader.js",
		"Build/buildweb.wasm.gz",
		"index.html",
		"StreamingAssets/UnityServicesProjectConfiguration.json",
		"TemplateData/favicon.ico",
		"TemplateData/fullscreen-button.png",
		"TemplateData/progress-bar-empty-dark.png",
		"TemplateData/progress-bar-empty-light.png",
		"TemplateData/progress-bar-full-dark.png",
		"TemplateData/progress-bar-full-light.png",
		"TemplateData/style.css",
		"TemplateData/unity-logo-dark.png",
		"TemplateData/unity-logo-light.png",
		"TemplateData/webgl-logo.png"
	];

	for (const seedFile of seedFiles) {
		console.log(`Inserting seed file ${seedFile}`);

		const result = unityappRepository.addFileToProject(
			"test123456",
			seedFile,
			2048, // 2kb
			true // Allow upsert
		);

		if (result.status !== "SUCCESS") {
			console.error("Error inserting the instructor");
			return false;
		}
	}

	console.log("Successfully inserted all seed data.");

	return true;
}

export default seed;
