import dotenv from "dotenv";
import Path from "path";

dotenv.config();

interface Config {
	port: number;
	nodeEnv: string;
	domainUrl: string;
	storageDir: string;
	unityProjectsDir: string;
	resourcesDir: string;
}

const STORAGE_DIR = Path.join(process.cwd(), "storage");

const config: Config = {
	port: Number(process.env.PORT) || 3000,
	nodeEnv: process.env.NODE_ENV || "development",
	domainUrl: process.env.DOMAIN_URL || "undefined",
	storageDir: STORAGE_DIR,
	unityProjectsDir: Path.join(
		STORAGE_DIR,
		"unity_projects"
	),
	resourcesDir: Path.join(__dirname, "resources")
} as const;

if (config.domainUrl === "undefined") {
	throw new Error(
		"DOMAIN_URL is undefined. Please specify this in the server side .env"
	);
}

console.log("Using config: ", config);

export default config;
