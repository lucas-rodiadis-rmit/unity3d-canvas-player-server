import { Request, Response, Router } from "express";
import {
	ReasonPhrases,
	StatusCodes
} from "http-status-codes";

import {
	ErrorResponse,
	OpenIDConfigResponse,
	RegisterQueryParams,
	SuccessResponse
} from "./types";

/**
 * This file contains the registration router for handling OpenID configuration requests.
 * It defines the routes and their corresponding handlers for the registration process.
 */
const router = Router();

/**
 * GET /register
 * This endpoint is not allowed for GET requests.
 */
router.get("/", (_, res) => {
	res.status(StatusCodes.METHOD_NOT_ALLOWED)
		.set("Allow", "POST")
		.send(ReasonPhrases.METHOD_NOT_ALLOWED);
});

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

		// Check for missing parameters
		if (!openid_configuration || !registration_token) {
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({
					error: "Missing required parameters: openid_configuration and/or registration_token"
				});
		}

		try {
			// Fetch the OpenID configuration from the given URL with authorization token
			const response = await fetch(
				openid_configuration as string,
				{
					headers: {
						Accept: "application/json",
						Authorization: `Bearer ${registration_token}`
					}
				}
			);

			// Handle failed response from the OpenID configuration fetch
			if (!response.ok) {
				throw new Error(
					`HTTP ${response.status}: ${response.statusText}`
				);
			}

			// Parse the OpenID configuration response
			const canvasConfig: OpenIDConfigResponse =
				await response.json();

			// Log the fetched configuration
			console.log(
				"Canvas OpenID Config:",
				canvasConfig
			);

			// Send successful response with OpenID issuer
			res.status(StatusCodes.OK).json({
				message:
					"OpenID Configuration fetched successfully.",
				canvas_issuer: canvasConfig.issuer
			});
		} catch (error) {
			// Log and return error response if fetch fails
			console.error(
				"Failed to fetch OpenID configuration:",
				error
			);
			res.status(
				StatusCodes.INTERNAL_SERVER_ERROR
			).json({
				error: "Failed to fetch OpenID configuration"
			});
		}
	}
);

export default router;
