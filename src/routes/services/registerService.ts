import { OpenIDConfigResponse } from "../types";

/**
 * Fetches OpenID configuration from the given URL with the provided authorization token.
 * @param openidConfigurationUrl - The URL of the OpenID configuration.
 * @param registrationToken - The authorization token for the request.
 * @returns The OpenID configuration JSON object if successful, or an error message if failed.
 */
export const fetchOpenIDConfig = async (
	openidConfigurationUrl: string,
	registrationToken: string
): Promise<OpenIDConfigResponse | string> => {
	try {
		// Fetch the OpenID configuration from the given URL with authorization token
		const response = await fetch(
			openidConfigurationUrl,
			{
				headers: {
					Accept: "application/json",
					Authorization: `Bearer ${registrationToken}`
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

		return canvasConfig;
	} catch (error) {
		console.error(
			"Failed to fetch OpenID configuration:",
			error
		);
		return "Failed to fetch OpenID configuration";
	}
};

/**
 * Fetches registration creation from the given URL with the provided authorization token.
 * @param registrationToken - The authorization token for the request.
 * @param registrationEndpoint - The URL of the registration endpoint.
 * @returns The registration creation JSON object if successful, or an error message if failed.
 */
export const fetchRegistrationCreation = async (
	registrationToken: string,
	registrationEndpoint: string
): Promise<any> => {
    try {
        // Fetch the registration creation from the given URL with authorization token
        const response = await fetch(
            registrationEndpoint,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${registrationToken}`
                }
            }
        );

        // Handle failed response from the registration creation fetch
        if (!response.ok) {
            throw new Error(
                `HTTP ${response.status}: ${response.statusText}`
            );
        }

        // Parse the registration creation response
        const registrationCreationResponse = await response.json();

        return registrationCreationResponse;
    } catch (error) {
        console.error(
            "Failed to fetch registration creation:",
            error
        );
        return "Failed to fetch registration creation";
    }
};
