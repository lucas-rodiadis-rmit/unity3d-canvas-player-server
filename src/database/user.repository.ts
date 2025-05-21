import { Instructor } from "../types";
import {
	DB,
	DBInternalInstructor,
	INSTRUCTOR_TABLE
} from "./internals";
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
		data: { userId: row.user_id, type: "INSTRUCTOR" }
	};
}

function addInstructor(
	userId: string,
	email?: string,
	allowUpsert?: boolean
): DBGetResult<Instructor> {
	const stmt = DB.prepare<
		{ userId: string; email?: string },
		DBInternalInstructor
	>(
		`INSERT INTO ${INSTRUCTOR_TABLE} (user_id, email)
			VALUES (@userId, @email)
			${allowUpsert ? "ON CONFLICT(user_id) DO UPDATE SET email = excluded.email" : ""}
		RETURNING *`
	);

	const instructor = stmt.get({ userId, email });
	if (!instructor) return { status: "FAILURE" };

	return {
		status: "SUCCESS",
		data: {
			type: "INSTRUCTOR",
			userId: instructor.user_id
		}
	};
}

export default { getInstructor, addInstructor };
