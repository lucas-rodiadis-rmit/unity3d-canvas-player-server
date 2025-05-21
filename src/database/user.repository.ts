import { Instructor } from "../types";
import { DB, INSTRUCTOR_TABLE } from "./internals";
import { DBGetResult } from "./types";

function getInstructor(
	userId: string
): DBGetResult<Instructor> {
	const row: any = DB.prepare(
		`SELECT * FROM ${INSTRUCTOR_TABLE} i WHERE i.user_id = ?`
	).get(userId);

	if (!row) {
		return { status: "FAILURE" };
	}

	return {
		status: "SUCCESS",
		data: { user_id: row.user_id, type: "INSTRUCTOR" }
	};
}

function addInstructor(
	userId: string
): DBGetResult<Instructor> {
	// TODO: Do database query here and get the result
	return { status: "FAILURE" };
}

export default { getInstructor, addInstructor };
