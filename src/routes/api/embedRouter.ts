import dotenv from "dotenv";

import { Request, Response, Router } from "express";

import appConfig from "../../appConfig";

import {
	LTIContentItem,
	LTIEmbedRequestMessage
} from "../../lti";

import {
	CreateEmbedPayload,
	isCreateEmbedPayload
} from "../../types";

import axios from "axios";

dotenv.config();

const router = Router();

export let TEMPORARY_RETURN_URL = "UNSET_URL";

export function setReturnUrl(url: string) {
	console.log(
		`CHANGING TEMP RETURN URL FROM ${TEMPORARY_RETURN_URL} TO ${url}`
	);
	TEMPORARY_RETURN_URL = url;
}

export function getReturnUrl() {
	return TEMPORARY_RETURN_URL;
}

router.post(
	"/",
	async (req: Request, res: Response): Promise<void> => {
		if (!isCreateEmbedPayload(req.body)) {
			res.status(400);
			return;
		}

		const embedRequest = createReturnEmbed(req.body);

		// TODO: Replace this with a real database call
		const returnUrl = getReturnUrl();

		const result = await axios.post(
			returnUrl,
			embedRequest
		);

		console.log("Result from embed request: ", result);
	}
);

function createReturnEmbed(
	payload: CreateEmbedPayload
): LTIEmbedRequestMessage {
	const embedUrl: string =
		appConfig.domainUrl + "unity-player/test123456";

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
