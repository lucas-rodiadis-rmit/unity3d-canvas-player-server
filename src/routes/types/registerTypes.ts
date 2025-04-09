import {
	ToolDisplayType,
	ToolMessageType,
	ToolMessageVisibility,
	ToolPrivacyLevel
} from "./registerEnums";

/**
 * This file contains TypeScript interfaces for the OpenID configuration and registration process.
 * It defines the structure of the request and response objects used in the registration endpoint.
 * The interfaces include:
 * - RegisterQueryParams: Represents the query parameters for the registration request.
 * - OpenIDConfigResponse: Represents the response from the OpenID provider.
 * - SuccessResponse: Represents a successful response from the registration endpoint.
 * - ErrorResponse: Represents an error response from the registration endpoint.
 */

/**
 * Interface for the query parameters used in the registration request.
 * This structure defines the optional query parameters expected in the request URL.
 *
 * - openid_configuration (optional): A string representing a URL pointing to the OpenID configuration endpoint.
 * - registration_token (optional): A string representing a token used for authenticating the registration request.
 */
export interface RegisterQueryParams {
	openid_configuration?: string; // A string URL for the OpenID configuration
	registration_token?: string; // A string token for authentication
}

/**
 * Interface for the OpenID configuration response.
 * This structure defines the expected properties in the response from the OpenID provider.
 *
 * - issuer: A string representing the URL of the OpenID provider's issuer.
 * - authorization_endpoint: A string representing the URL for the Canvas authorization endpoint.
 * - registration_endpoint: A string representing the URL for the Canvas registration endpoint.
 *
 * Other properties can be added based on the structure of the OpenID configuration.
 */
export interface OpenIDConfigResponse {
	issuer: string; // A string representing the OpenID issuer URL
	authorization_endpoint: string;
	registration_endpoint: string;
	// You can add other properties based on the structure of the OpenID configuration
}

/**
 * Interface for the request body used in the registration process.
 * This structure defines the properties expected in the request body when creating a registration.
 */
export interface LTIRegistrationReqBody {
	application_type: string;
	grant_types: string[];
	initiate_login_uri: string;
	redirect_uris: string[];
	response_types: string;
	client_name: string;
	jwks_uri: string;
	token_endpoint_auth_method: string;
	scope: string;
	"https://purl.imsglobal.org/spec/lti-tool-configuration": LTIToolConfigurationSchema;
}

/**
 * Interface for the tool configuration schema used in the registration process.
 * This structure defines the properties expected in the tool configuration.
 */
export interface LTIToolConfigurationSchema {
	domain: string;
	secondary_domains: string[];
	target_link_uri: string;
	custom_parameters?: JSON;
	description?: string;
	messages: LTIMessageSchema[];
	claims: [];
	"https://canvas.instructure.com/lti/privacy_level"?: ToolPrivacyLevel;
	"https://canvas.instructure.com/lti/tool_id"?: string;
}

/**
 * Interface for the message schema used in the registration process.
 * This structure defines the properties expected in the message schema.
 */
export interface LTIMessageSchema {
	type: ToolMessageType;
	target_link_uri?: string;
	label?: string;
	icon_uri?: string;
	custom_parameters?: JSON;
	placements?: [];
	"https://canvas.instructure.com/lti/course_navigation/default_enabled"?: boolean;
	"https://canvas.instructure.com/lti/visibility"?: ToolMessageVisibility;
	"https://canvas.instructure.com/lti/launch_height"?:
		| string
		| number;
	"https://canvas.instructure.com/lti/launch_width"?:
		| string
		| number;
	"https://canvas.instructure.com/lti/display_type"?: ToolDisplayType;
}

/**
 * Interface for the success response returned when the OpenID configuration is successfully fetched.
 * This structure defines the properties of a successful response.
 *
 * - message: A string containing a success message indicating that the OpenID configuration was fetched successfully.
 * - canvas_issuer: A string representing the OpenID provider's issuer extracted from the fetched configuration.
 */
export interface SuccessResponse {
	message: string; // A string message indicating success
	canvas_issuer: string; // A string representing the OpenID provider's issuer
}

/**
 * Interface for the error response returned when there is an issue with the registration process.
 * This structure defines the properties of an error response.
 *
 * - error: A string describing the error encountered.
 */
export interface ErrorResponse {
	error: string; // A string describing the error message
}

