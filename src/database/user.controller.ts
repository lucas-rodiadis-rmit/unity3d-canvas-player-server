import { Instructor } from "../types";
import userRepository from "./user.repository";

function getInstructor(userId: string): Instructor | null {
	const instructor = userRepository.getInstructor(userId);
	if (instructor.status !== "SUCCESS") return null;

	return instructor.data;
}

function addInstructor(
	userId: string,
	email?: string
): Instructor | null {
	const instructor = userRepository.addInstructor(
		userId,
		email,
		false
	);
	if (instructor === null) return null;

	return null;
}

export default {
	getInstructor,
	addInstructor
};
