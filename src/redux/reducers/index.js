import { combineReducers } from 'redux';
import { auth } from './auth';
import { globalError } from './globalError';
import { generateViewListsReducers } from './viewLists';
import { user } from './user';
import { USER_TYPE_ID, USER_ROLE_STRING } from '../../constants/user';
import { technicalAreaManagerViewReducer } from './views/technicalAreaManager';
import { revisionOfficeManagerViewReducer } from './views/revisionOfficeManager';
import { programmerViewReducer } from './views/programmer';
import { clientViewReducer } from './views/client';

/**
 * @file
 * This file is the root of the reducers.
 * We need to combine all the various reducers functions into one,
 * thus having a better hierarchy of the state.
 * We can sum up the hierarchy as follows:
 * |-- auth
 * |-- user
 * |-- lists
 * |   |-- programmer
 * |   |   |-- commits
 * |   |   |-- sendRequests
 * |   |-- technicalAreaManager
 * |   |   |-- commits
 * |   |-- revisionOfficeManager
 * |   |   |-- sendRequests
 * |   |-- client
 * |       |-- sendRequests (TBD)
 * |-- views
 * |   |-- technicalAreaManager
 * |   |-- revisionOfficeManager
 * |-- globalError
 * Lists reducers are generated dynamically (see viewLists.js for details).
 */

const reducers = combineReducers({
  auth,
  user,
  lists: combineReducers(
    generateViewListsReducers([
      USER_TYPE_ID.PROGRAMMER,
      USER_TYPE_ID.TECHNICAL_AREA_MANAGER,
      USER_TYPE_ID.REVISION_OFFICE_MANAGER,
      USER_TYPE_ID.CLIENT
    ])
  ),
  views: combineReducers({
    [USER_ROLE_STRING[USER_TYPE_ID.PROGRAMMER]]: programmerViewReducer,
    [USER_ROLE_STRING[USER_TYPE_ID.TECHNICAL_AREA_MANAGER]]: technicalAreaManagerViewReducer,
    [USER_ROLE_STRING[USER_TYPE_ID.REVISION_OFFICE_MANAGER]]: revisionOfficeManagerViewReducer,
    [USER_ROLE_STRING[USER_TYPE_ID.CLIENT]]: clientViewReducer
  }),
  globalError
});

export default reducers;
