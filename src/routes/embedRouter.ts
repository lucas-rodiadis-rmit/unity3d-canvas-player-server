import { Request, Response, Router } from "express";
import fs from "fs/promises";

const router = Router();

router.post(
	"/",
	async (req: Request, res: Response): Promise<void> => {
		const filePath = "/resources/embed.html";

		// Debug: confirm Canvas sent the data
		console.log("BODY:", req.body);

		try {
			let html = await fs.readFile(filePath, "utf-8");

			if (
				req.body &&
				req.body.ext_content_return_url
			) {
				html = html.replace(
					/{{RETURN_URL}}/g,
					req.body.ext_content_return_url
				);
			} else {
				console.warn(
					"No ext_content_return_url found in request body."
				);
			}

			res.send(html);
		} catch (err) {
			console.error("Error sending embed HTML:", err);
			res.status(500).send("Internal Server Error");
		}
	}
);

export default router;
