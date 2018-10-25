/**
 * @file
 * This file contains helper functions and constants used to make API calls.
 */

const API_ENDPOINT_URL = 'http://aum.altervista.org/main.php';

export const REQUEST_ACTIONS_PATHS = {
    LOGIN: 'auth/login',
    LOGOUT: 'auth/logout',
    VALIDATE_TOKEN: 'auth/validateToken',
    GET_USER_INFO: 'user/info'
}

/**
 * Makes a request to the server without passing the access token in the headers
 * Intended for those actions that don't require authentication
 * @param {*} actionPath One of the paths defined in REQUEST_ACTIONS_PATHS
 * @param {*} requestData The object containing the request data (optional for an empty object)
 */
export function makeUnauthenticatedApiRequest(actionPath, requestData = {}) {
    return fetch(`${API_ENDPOINT_URL}/${actionPath}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ request_data: requestData }),
    });
}

/**
 * Makes a request to the server passing the access token in the headers
 * Used for those actions that need user authentication
 * @param {*} actionPath One of the paths defined in REQUEST_ACTIONS_PATHS
 * @param {*} requestData The object containing the request data (optional for an empty object)
 */
export function makeAuthenticatedApiRequest(actionPath, accessToken, requestData = {}) {
    return fetch(`${API_ENDPOINT_URL}/${actionPath}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Auth-Header': accessToken
        },
        body: JSON.stringify({ request_data: requestData }),
    });
}