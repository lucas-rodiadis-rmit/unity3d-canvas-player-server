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
 *
 * Other properties can be added based on the structure of the OpenID configuration.
 */
export interface OpenIDConfigResponse {
	issuer: string; // A string representing the OpenID issuer URL
	// You can add other properties based on the structure of the OpenID configuration
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
