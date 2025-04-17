import { Request, Response, Router } from "express";
import path from "path";
import fs from "fs/promises";

const router = Router();

router.post("/", async (req: Request, res: Response): Promise<void> => {
	const filePath = path.join(__dirname, "../resources/embed.html");
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
	try {
		const html = await fs.readFile(filePath, "utf-8");
		res.send(html);
	} catch (err) {
		console.error("Error sending embed HTML:", err);
		res.status(500).send("Internal Server Error");
	}
});

router.post("/lti/launch", async (req: Request, res: Response): Promise<void> => {
	console.log("LTI launch request received:", req.body);
	res.send(`
        <html>
          <head><title>Unity Game</title></head>
          <body>
            <iframe src="https://canvasunityplayer.hudini.online/unity-player" width="100%" height="800" allowfullscreen></iframe>
          </body>
        </html>
    `);
});

export default router;
