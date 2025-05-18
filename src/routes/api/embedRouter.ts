import dotenv from "dotenv";
import { Request, Response, Router } from "express";
import appConfig from "../../appConfig";
import { isCreateEmbedPayload } from "../../types";

dotenv.config();

const router = Router();

router.post(
	"/",
	async (req: Request, res: Response): Promise<void> => {
		if (!isCreateEmbedPayload(req.body)) {
			res.status(400);
			return;
		}

		// TODO: Lookup return URL from cache
		const returnUrl = "REPLACE_ME";

		const embedUrl: string =
			appConfig.domainUrl + "unity-player/test123456";

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
