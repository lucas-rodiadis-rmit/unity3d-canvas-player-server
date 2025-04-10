import { Request, Response, Router } from "express";

const router = Router();

/**
 * Serve Unity plugin embed to Canvas content editor
 */
router.post(
	"/",
	async (req: Request, res: Response): Promise<any> => {
		const unityUrl =
			"https://169c-131-170-250-218.ngrok-free.app/unity-player";

		try {
			const iframeHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Insert Unity3D Player</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              background-color: #f9f9f9;
            }
            h2 {
              color: #333;
            }
            p {
              margin-top: 10px;
              margin-bottom: 20px;
            }
            button {
              background-color: #007aff;
              color: white;
              border: none;
              padding: 10px 20px;
              font-size: 16px;
              border-radius: 4px;
              cursor: pointer;
            }
            button:hover {
              background-color: #005ecb;
            }
          </style>
        </head>
        <body>
          <h2>Embed Unity3D Player</h2>
          <p>Click the button below to embed the Unity3D Player into your Canvas content.</p>
          <button onclick="embedUnity()">Embed Unity3D Player</button>

          <script>
            function embedUnity() {
              const contentItem = {
                subject: "lti.content_itemSelection",
                content_items: [
                  {
                    type: "iframe",
                    value: '<iframe src="${unityUrl}" width="800" height="600" style="border:0;" allowfullscreen></iframe>'
                  }
                ]
              };

              window.parent.postMessage(contentItem, "*");
            }
          </script>
        </body>
      </html>
    `;

			res.send(iframeHtml);
		} catch (err) {
			console.error("Error sending embed HTML:", err);
			res.status(500).send("Internal Server Error");
		}
	}
);

export default router;

