import fs from "fs";
import path from "path";

import Database from "better-sqlite3";

// const DB_ROOT_DIR: string = __dirname + "/database";
const DB_MIGRATIONS_DIR: string = path.join(
	process.cwd(),
	"src",
	"resources",
	"migrations"
);
const DB_CURRENT_MIGRATION_FILE = path.join(
	process.cwd(),
	"src",
	"resources",
	"migrations",
	"current_migration"
);

const DB_FILE: string = path.join(
	process.cwd(),
	"storage",
	"database.db"
);

export const DB = new Database(DB_FILE);

/*
db.serialize(() => {
	db.run("CREATE TABLE lorem (info TEXT)");
	const stmt = db.prepare("INSERT INTO lorem VALUES (?)");

	for (let i = 0; i < 10; i++) {
		stmt.run(`Ipsum ${i}`);
	}

	stmt.finalize();

	db.each(
		"SELECT rowid AS id, info FROM lorem",
		(err, row) => {
			console.log(`${row.id}: ${row.info}`);
		}
	);
});
*/

function setCurrentMigration(outPath: string): boolean {
	try {
		fs.writeFileSync(
			DB_CURRENT_MIGRATION_FILE,
			path.basename(outPath)
		);
		return true;
	} catch (error) {
		console.error(
			`Error when setting current migration. Please manually update it to ${path.basename(outPath)}. ${error}`
		);
	}
	return false;
}

function getCurrentMigration(): string | null {
	if (!fs.existsSync(DB_CURRENT_MIGRATION_FILE))
		return "";

	try {
		const file: string = fs
			.readFileSync(DB_CURRENT_MIGRATION_FILE)
			.toString();

		if (file.lastIndexOf("/") != -1) {
			return file.slice(file.lastIndexOf("/") + 1);
		}

		return file.toString();
	} catch (error) {}

	return null;
}

export function initialiseDb(
	migrate: boolean = true
): boolean {
	console.log("\nInitialising Database.");
	if (!DB.open) {
		console.error("The database could not be opened.");
		return false;
	}

	if (!fs.existsSync(DB_FILE) && !migrate) {
		console.error(
			`No DB is available under ${DB_FILE}  and migrate is false. Unable to create the database.`
		);
		return false;
	}

	if (!fs.existsSync(DB_MIGRATIONS_DIR)) {
		throw new Error(
			`Migrations folder  ${DB_MIGRATIONS_DIR}  does not exist.`
		);
	}

	let migrations: string[] = fs
		.readdirSync(DB_MIGRATIONS_DIR)
		.map((val) => DB_MIGRATIONS_DIR + "/" + val);

	if (migrations.length === 0) {
		throw new Error(
			"No migrations present. Unable to proceed with startup."
		);
	}

	const currentMigration = getCurrentMigration();

	if (currentMigration) {
		const currentMigrationFile: string =
			DB_MIGRATIONS_DIR +
			"/" +
			currentMigration.toString();
		const index = migrations.findIndex(
			(val) => val === currentMigrationFile
		);

		// If the current migration file could not be found
		if (index === -1) {
			throw new Error(
				`Migrations out of order, unable to find current migration file  ${currentMigrationFile}`
			);
		} else if (index === migrations.length - 1) {
			console.log(
				`Database is up to date with migration ${path.basename(migrations[migrations.length - 1])}`
			);
			return true;
		}

		// Get rid of all of the old migrations from the list
		migrations = migrations.slice(index + 1);
	}

	console.log(
		`Database out of date. Executing ${migrations.length} migrations.`
	);

	for (const migration of migrations) {
		console.log(
			`- Executing ${path.basename(migration)}`
		);
		try {
			const script = fs.readFileSync(
				migration,
				"utf8"
			);
			DB.exec(script);

			console.log(
				`- Finished ${path.basename(migration)}`
			);
			setCurrentMigration(migration);
		} catch (error) {
			console.error(
				"Error during execution of migration script:\n\n",
				(error as Error).name,
				(error as Error).message
			);

			return false;
		}

		console.log(
			"All migrations executed successfully."
		);
	}

	return true;
}

process.on("exit", () => DB.close());
