import { NextFunction, Request, Response } from "express";

/**
 * Middleware to set the Content-Encoding header for gzipped files
 * This middleware checks if the requested file ends with .gz and sets the appropriate headers.
 * It also sets the Content-Type header based on the file extension.
 */
export const gzipHandler = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
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

	next();
};
