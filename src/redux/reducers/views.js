import { USER_ROLE_STRING, USER_TYPE_ID } from '../../constants/user';
import { LIST_ELEMENTS_TYPE } from '../../constants/api';
import { listReducer } from './lists';

const stateShapes = {
  [USER_TYPE_ID.PROGRAMMER]: {
    [LIST_ELEMENTS_TYPE.COMMITS]: undefined,
    [LIST_ELEMENTS_TYPE.SEND_REQUESTS]: undefined
  },
  [USER_TYPE_ID.TECHNICAL_AREA_MANAGER]: {
    [LIST_ELEMENTS_TYPE.COMMITS]: undefined
  },
  [USER_TYPE_ID.REVISION_OFFICE_MANAGER]: {
    [LIST_ELEMENTS_TYPE.SEND_REQUESTS]: undefined
  }
};

/**
 * Slice reducers generated by this function handle list-related actions for the view (e.g. ProgrammerView, ClientView etc.)
 * they refer to.
 * This universal reducer model is designed to work with slices of state that have different shapes: as you can see above,
 * ProgrammerView has both commits and send requests lists whereas TechnicalAreaManagerView only commits one.
 */
function generateViewReducer(userTypeId) {
  return (state = stateShapes[userTypeId], action) => {
    if ('userRoleString' in action) {
      if (action.userRoleString === USER_ROLE_STRING[userTypeId]) {
        const newState = { ...state };
        if (action.elementType === LIST_ELEMENTS_TYPE.COMMITS && LIST_ELEMENTS_TYPE.COMMITS in state)
          newState[LIST_ELEMENTS_TYPE.COMMITS] = listReducer(state[LIST_ELEMENTS_TYPE.COMMITS], action);
        else if (action.elementType === LIST_ELEMENTS_TYPE.SEND_REQUESTS && LIST_ELEMENTS_TYPE.SEND_REQUESTS in state)
          newState[LIST_ELEMENTS_TYPE.SEND_REQUESTS] = listReducer(state[LIST_ELEMENTS_TYPE.SEND_REQUESTS], action);
        return newState;
      }
      return state;
    }
    // Actions that are not view-specific must be passed in any case to sub-reducers to allow initialization
    else {
      const newState = {};
      Object.keys(stateShapes[userTypeId]).forEach(key => (newState[key] = listReducer(state[key], action)));
      return newState;
    }
  };
}

/**
 * Generates the view reducers for the user ids passed to this function.
 * @returns an object whose keys are the names of the roles given
 */
export function generateViewReducers(userTypeIds) {
  let reducers = {};
  userTypeIds.forEach(id => {
    reducers[USER_ROLE_STRING[id]] = generateViewReducer(id);
  });
  return reducers;
}