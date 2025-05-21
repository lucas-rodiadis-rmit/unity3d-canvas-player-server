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

	const seedProjects = [
		[
			"test_instructor_1",
			"ClinicSim",
			"/test123456",
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

	console.log("Successfully inserted all seed data.");

	return true;
}

export default seed;
