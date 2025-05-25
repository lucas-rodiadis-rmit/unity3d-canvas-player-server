import dotenv from "dotenv";
dotenv.config(); // ensures process.env has variables defined in .env

import { Request, Response, Router } from "express";

import appConfig from "../../appConfig";

// Import LTI-related types
import {
	LTIContentItem,
	LTIEmbedRequestMessage
} from "../../lti";

// Import custom payload type and type guard
import {
	CreateEmbedPayload,
	isCreateEmbedPayload
} from "../../types";

// Import HTTP client for sending outgoing requests
import axios from "axios";

const router = Router();

// TEMPORARY variable to store return URL – in real applications, this should be stored securely or in a database
export let TEMPORARY_RETURN_URL = "UNSET_URL";

// Setter function for TEMPORARY_RETURN_URL
export function setReturnUrl(url: string) {
	console.log(
		`CHANGING TEMP RETURN URL FROM ${TEMPORARY_RETURN_URL} TO ${url}`
	);
	TEMPORARY_RETURN_URL = url;
}

// Getter function for TEMPORARY_RETURN_URL
export function getReturnUrl() {
	return TEMPORARY_RETURN_URL;
}

// POST route handler for creating an LTI Embed response
router.post(
	"/",
	async (req: Request, res: Response): Promise<void> => {
		// Validate request body shape using a type guard
		if (!isCreateEmbedPayload(req.body)) {
			res.status(400); // Bad request if payload is invalid
			return;
		}

		// Convert valid payload into LTI embed message format
		const embedRequest = createReturnEmbed(req.body);

		// Get return URL where the embed should be sent
		const returnUrl = getReturnUrl();

		// Send the embed request to the return URL (likely a learning platform)
		const result = await axios.post(
			returnUrl,
			embedRequest
		);

		// Log the result of the POST request for debugging
		console.log("Result from embed request: ", result);
	}
);

// Function to generate an LTI-compliant embed message
function createReturnEmbed(
	payload: CreateEmbedPayload
): LTIEmbedRequestMessage {
	const embedUrl: string =
		appConfig.domainUrl +
		`/unity-player/${payload.project_id}`;

	const graph: LTIContentItem = {
		"@type": "LtiLinkItem",
		"@id": embedUrl,
		url: embedUrl,
		title: "Unity Player Embed",
		text: "Play Now!",
		mediaType: "application/vnd.ims.lti.v1.ltilink",
		placementAdvice: {
			presentationDocumentTarget: "frame"
		}
	};

	graph.placementAdvice =
		payload.presentation_type === "iframe"
			? {
					presentationDocumentTarget: "iframe",
					displayWidth: payload.width,
					displayHeight: payload.height
				}
			: {
					presentationDocumentTarget: "frame"
				};

	const embedMessage: LTIEmbedRequestMessage = {
		lti_message_type: "ContentItemSelection",
		lti_version: "LTI-1p0",
		mediaType: "application/vnd.ims.lti.v1.ltilink",
		content_items: [graph]
	};

	return embedMessage;
}

export default router;
