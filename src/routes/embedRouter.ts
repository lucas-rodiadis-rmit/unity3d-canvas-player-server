import { Request, Response, Router } from "express";
import dotenv from "dotenv";

dotenv.config();

const router = Router();

router.post(
	"/",
	async (req: Request, res: Response): Promise<void> => {
		console.log("BODY:", req.body);

		const returnUrl: string = req.body?.ext_content_return_url;
		const embedUrl: string =
			process.env.EMBED_PLAYER_URL +
			"unity-player/test123456";

		if (!returnUrl) {
			console.warn(
				"No ext_content_return_url found in request body."
			);
			res.status(400).send("Missing return URL");
			return;
		}

		try {
			// Render the embed.ejs template with the provided data
			res.render("embed", {
				returnUrl,
				embedUrl
			});
		} catch (err) {
			console.error(
				"Error rendering embed selection page:",
				err
			);
			res.status(500).send("Internal Server Error");
		}
	}
);

export default router;
