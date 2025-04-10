import express, {
	NextFunction,
	Request,
	Response,
	Router
} from "express";
import path from "path";

const router = Router();

router.get(
	"/",
	function (
		req: Request,
		res: Response,
		next: NextFunction
	) {
		// Change this to send back the react app instead
		res.send("Hello world!");
	}
);

// Serve Unity player at the 'unity-player' endpoint
router.get(
	"/unity-player",
	function (
		req: Request,
		res: Response,
		next: NextFunction
	) {
		// res.send("<html> <iframe src='../../dist/index.html' width='50%' 'height=50%' /> </html>");

		res.sendFile(
			path.join(__dirname, "../../dist/index.html")
		);
	}
);


// router.get("*.gz", (req, res, next) => {
// 	/*
// 	const encoding = req.headers['accept-encoding'] || '';
// 	if (!encoding.includes('gzip')) return next();

// 	const originalPath = path.join(staticDir, req.path);
// 	const gzPath = originalPath + '.gz';

// 	fs.access(gzPath, fs.constants.F_OK, (err) => {
// 	  if (err) return next();

// 	  const contentType = mime.lookup(req.path);
// 	  if (contentType) {
// 		res.setHeader('Content-Type', contentType);
// 	  }
// 	  res.setHeader('Content-Encoding', 'gzip');
// 	  res.setHeader('Vary', 'Accept-Encoding');
// 	  res.sendFile(gzPath);
// 	});

//   */
// });

// router.get("/ClinicSim", (req, res, next) => {
router.use((req, res, next) => {
	// const file: string = req.params.file;
	// console.log("FILE: ", file);

	// If the file ends with .gz, set the Content-Encoding to gzip
	if (req.path.endsWith(".gz")) {
		res.set("Content-Encoding", "gzip");

		// Set the correct content type for .js.gz files
		if (req.path.endsWith(".js.gz")) {
			res.set(
				"Content-Type",
				"application/javascript"
			);
		}

		// Set the correct content type for .wasm files
		if (req.path.endsWith(".wasm.gz")) {
			res.set("Content-Type", "application/wasm");
		}

		if (req.path.endsWith(".data.gz")) {
			res.set(
				"Content-Type",
				"application/octet-stream"
			);
		}
	}

	// const readFilefs.readFileSync(path.join(__dirname, file));
	// res.sendFile();
	next();
});

/*
router.get("/:file/", (req, res, next) => {
	const file: string = req.path["file"];
	if (file.endsWith(".gz")) {
		res.setDefaultEncoding("gzip");
	}

	if (req.path["file"].endsWith(".js.gz")) {
		res.header.contentType = "application/javascript";
	}

	if (req.path["file"].endsWith(".wasm")) {
		res.header.contentType = "application/wasm";
	}
});
*/

// Serve static files from the 'dist' folder
router.use(
	"/",
	express.static(path.join(__dirname, "../../dist"))
);


export default router;