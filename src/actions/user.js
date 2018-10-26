/**
 * @file
 * This file contains all the action creators used to get or manipulate user data.
 */

export const USER_ACTION_TYPE_KEYS = {
  GET_USER_INFO_REQUEST: 'GET_USER_INFO_REQUEST',
  GET_USER_INFO_SUCCESSFUL: 'GET_USER_INFO_SUCCESSFUL',
  GET_USER_INFO_FAILED: 'GET_USER_INFO_FAILED'
};

export function requestCurrentUserInfo(accessToken) {
  return {
    type: USER_ACTION_TYPE_KEYS.GET_USER_INFO_REQUEST,
    accessToken
  }
}