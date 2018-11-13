import { COMMITS_ACTION_TYPE_KEYS } from '../actions/commits';

export const initialState = {
  /*
    listPages will contain objects with the following shape:
    {
      data: [],             -- the list of commits for the page
      updateTimestamp: 0    -- the value of state.latestCommitTimestamp when the page was retrieved
    }
  */
  listPages: [],
  latestCommitTimestamp: 0,   // timestamp of the most recent commit, used to check if there have been updates remotely
  totalCommitsCount: 0,
  currentlyShowingCommit: null,
  actionPending: false,
  isLoadingList: true
};

export function commits(state = initialState, action) {
  switch (action.type) {
    case COMMITS_ACTION_TYPE_KEYS.PERFORMING_REQUEST:
      return {
        ...state,
        actionPending: true
      }
    case COMMITS_ACTION_TYPE_KEYS.COMMITS_LIST_PAGE_REQUEST:
      return {
        ...state,
        isLoadingList: true
      }
    case COMMITS_ACTION_TYPE_KEYS.COMMITS_LIST_PAGE_RETRIEVED_FROM_SERVER:
      const newState = {
        ...state,
        isLoadingList: false,
        totalCommitsCount: action.serverResponse.count,
        currentlyShowingPage: action.pageNumber,
      };
      newState.listPages = [...state.listPages];  // objects are not deeply copied, that would just be too painful
      if (!(action.pageNumber in newState.listPages))
        newState.listPages[action.pageNumber] = {};
      newState.listPages[action.pageNumber].data = action.serverResponse.commit_list;
      
      // If this is the first time a page is retrieved, the latest commit timestamp is equal to the
      // timestamp of the first commit (which will obviously belong to page 0)
      // (it won't be needed anymore when update check will be implemented)
      if (state.latestCommitTimestamp === 0)
        newState.latestCommitTimestamp = action.serverResponse.commit_list[0].timestamp;
      newState.listPages[action.pageNumber].updateTimestamp = newState.latestCommitTimestamp;
      return newState;
    case COMMITS_ACTION_TYPE_KEYS.COMMITS_LIST_NO_RETRIEVAL_NEEDED:
    case COMMITS_ACTION_TYPE_KEYS.COMMITS_LIST_PAGE_RETRIEVAL_ERROR:  // TODO some sort of error message
      return {
        ...state,
        isLoadingList: false
      };
    default:
      return state;
  }
}