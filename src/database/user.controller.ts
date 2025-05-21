import { Instructor } from "../types";
import userRepository from "./user.repository";

function getInstructor(userId: string): Instructor | null {
	const instructor = userRepository.getInstructor(userId);
	if (instructor === null) return null;

	return null;
}

export default {
	getInstructor
};
