import { Request, Response, Router } from "express";

import {
	ErrorResponse,
	RegisterQueryParams,
	SuccessResponse
} from "./types";

import path from "path";

/**
 * This file contains the registration router for handling OpenID configuration requests.
 * It defines the routes and their corresponding handlers for the registration process.
 */
const router = Router();

/**
 * GET /lti-config.xml
 * This endpoint serves the LTI configuration XML file.
 */
router.get(
	"/lti-config.xml",
	(_req: Request, res: Response) => {
		res.set("Content-Type", "application/xml");
		res.sendFile(
			path.join(
				__dirname,
				"./resources/lti-config.xml"
			)
		);
	}
);

/**
 * GET /register
 * This endpoint is not allowed for GET requests.
 */
router.get(
	"/",
	async (req: Request, res: Response): Promise<any> => {
		const { openid_configuration, registration_token } =
			req.query;

		console.log("Incoming req.query:", req.query);

		if (!openid_configuration || !registration_token) {
			return res.status(400).json({
				error: "Missing required parameters: openid_configuration and/or registration_token"
			});
		}

		// Process the registration...
		res.send("Registration Success");
	}
);

/**
 * POST /register
 * This endpoint is used to register a new client with the OpenID provider.
 * @param {string} openid_configuration - The OpenID configuration URL.
 * @param {string} registration_token - The registration token for authentication.
 * @returns {object} - The OpenID configuration object.
 * @throws {400} - If the required parameters are missing.
 * @throws {500} - If there is an error fetching the OpenID configuration.
 */
router.post(
	"/",
	async (
		req: Request<{}, {}, {}, RegisterQueryParams>,
		res: Response<SuccessResponse | ErrorResponse>
	): Promise<any> => {
		const { openid_configuration, registration_token } =
			req.query;

		// Log incoming request query parameters
		/*
		console.log("Incoming req.query:", req.query);
		console.log("Request URL:", req.originalUrl);
		console.log("Request Method:", req.method);
		console.log("Incoming req.body:", req.body);
		console.log("Incoming req.params:", req.params);
		console.log("Incoming req.headers:", req.headers);
*/

		console.log(JSON.stringify(req));

		// Send html file for  registration
		res.sendFile(
			path.join(__dirname, "./resources/index.html")
		);

		// try {
		// 	// Check for missing parameters
		// 	if (
		// 		!openid_configuration ||
		// 		!registration_token
		// 	) {
		// 		throw new Error(
		// 			"Invalid openid_configuration or registration_token"
		// 		);
		// 	}
		// 	// Fetch OpenID configuration from the provided URL with the authorization token and registration token
		// 	const result = await fetchOpenIDConfig(
		// 		openid_configuration,
		// 		registration_token
		// 	);
		// 	if (typeof result === "string") {
		// 		throw new Error(
		// 			"Unexpected response type: string"
		// 		);
		// 	}
		// 	const canvasOpenIdConfig: OpenIDConfigResponse =
		// 		result;

		// 	// Log response json from OpenID configuration URL
		// 	console.log(
		// 		"Canvas OpenID Config:",
		// 		canvasOpenIdConfig
		// 	);

		// 	// Send successful response with OpenID issuer
		// 	res.status(StatusCodes.OK).json({
		// 		message:
		// 			"OpenID Configuration fetched successfully.",
		// 		canvas_issuer: canvasOpenIdConfig.issuer
		// 	});

		// 	// TODO: Send installation UI to Canvas

		// 	// TODO: Send registration creation request to registration_endpoint
		// } catch (error) {
		// 	// Log and return error response if fetch fails
		// 	console.error(
		// 		"Failed to fetch OpenID configuration:",
		// 		error
		// 	);
		// 	res.status(
		// 		StatusCodes.INTERNAL_SERVER_ERROR
		// 	).json({
		// 		error: "Failed to fetch OpenID configuration"
		// 	});
		// }
	}
);

export default router;
