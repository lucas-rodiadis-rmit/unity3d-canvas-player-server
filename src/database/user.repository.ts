import { Instructor } from "../types";
import { DBGetResult } from "./types";

function getInstructor(
	userId: string
): DBGetResult<Instructor> {
	// TODO: Do database query here and get the result
	return { status: "FAILURE" };
}

function addInstructor(
	userId: string
): DBGetResult<Instructor> {
	// TODO: Do database query here and get the result
	return { status: "FAILURE" };
}

export default { getInstructor, addInstructor };
