import React from 'react';
import withErrorBoundary from '../../components/WithErrorBoundary';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ElementDetailsDialog from '../../components/ElementDetailsDialog';
import { COMMON_ELEMENT_ATTRIBUTE, SEND_REQUEST_ATTRIBUTE } from '../../constants/elements';
import { USER_ROLE_STRING, USER_TYPE_ID } from '../../constants/user';
import { performNewSearchAction } from '../../redux/actions/commonList';
import {
  retrieveSendRequestsListPageAction,
  startSendRequestsListUpdatesAutoCheckingAction,
  stopSendRequestsListUpdatesAutoCheckingAction
} from '../../redux/actions/sendRequests';
import { renderElementFieldContent, retrieveElementFromListState } from '../../utils/viewUtils';
import { viewStyles } from '../styles';
import ClientTable from '../../components/ClientTable';
import InstallFeedbackDialog from '../../components/InstallFeedbackDialog/InstallFeedbackDialog';
import { CLIENT_ACTION_TYPE, sendFeedbackAction } from '../../redux/actions/views/client';

const detailsDialogFields = [
  { key: COMMON_ELEMENT_ATTRIBUTE.TITLE },
  { key: SEND_REQUEST_ATTRIBUTE.DELIVERY_TIMESTAMP },
  { key: COMMON_ELEMENT_ATTRIBUTE.DESCRIPTION },
  { key: COMMON_ELEMENT_ATTRIBUTE.COMPONENTS },
  { key: SEND_REQUEST_ATTRIBUTE.CLIENT_REPRESENTATIVES },
  { key: SEND_REQUEST_ATTRIBUTE.INSTALL_TYPE },
  { key: SEND_REQUEST_ATTRIBUTE.INSTALL_LINK },
  { key: SEND_REQUEST_ATTRIBUTE.INSTALL_FEEDBACK }
];

class ClientView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      detailsModalOpen: false,
      feedbackModalOpen: false,

      // must be set to an object when empty, otherwise render()
      // would throw an error (the id field is accessed in any case, see below)
      currentlyShowingElement: {}
    };
  }

  // Close feedback modal when it has been sent successfully
  static getDerivedStateFromProps(props, state) {
    if (props.successfullySentFeedbackForElements.includes(state.currentlyShowingElement.id))
      return { feedbackModalOpen: false };
    return null;
  }

  componentDidMount() {
    this.props.startSendRequestsListUpdatesAutoChecking(USER_ROLE_STRING[USER_TYPE_ID.CLIENT]);
  }

  componentWillUnmount() {
    this.props.stopSendRequestsListUpdatesAutoChecking(USER_ROLE_STRING[USER_TYPE_ID.CLIENT]);
    this.props.resetUI();
  }

  render() {
    const {
      classes,
      sendRequestsData,
      retrieveSendRequestsListPage,
      performNewSearch,
      sendFeedback,
      successfullySentFeedbackForElements,
      isSendingFeedback,
      lastFeedbackFailed
    } = this.props;
    const { detailsModalOpen, feedbackModalOpen, currentlyShowingElement } = this.state;

    return (
      <>
        <Grid container className={classes.root}>
          <Grid item xs={12}>
            <Grid container justify="center">
              <Paper className={classes.paper}>
                <ClientTable
                  tableData={sendRequestsData.listPages}
                  itemsCount={sendRequestsData.totalItemsCount}
                  isLoading={sendRequestsData.isLoadingList}
                  latestUpdateTimestamp={sendRequestsData.latestUpdateTimestamp}
                  displayError={sendRequestsData.errorWhileFetchingData}
                  loadPage={(pageNumber, sortingCriteria, filter) => {
                    retrieveSendRequestsListPage(
                      USER_ROLE_STRING[USER_TYPE_ID.CLIENT],
                      pageNumber,
                      sortingCriteria,
                      filter
                    );
                  }}
                  onSearchQueryChange={searchQuery => {
                    performNewSearch(
                      retrieveSendRequestsListPageAction(USER_ROLE_STRING[USER_TYPE_ID.CLIENT]),
                      searchQuery
                    );
                  }}
                  onElementDownload={this.downloadPatchFileInNewTab}
                  onElementFeedback={(elementId, pageNumber) => {
                    this.setState({
                      feedbackModalOpen: true,
                      currentlyShowingElement: retrieveElementFromListState(sendRequestsData, elementId, pageNumber)
                    });
                  }}
                  onElementClick={(pageNumber, rowIndex, elementId) => {
                    this.setState({
                      detailsModalOpen: true,
                      currentlyShowingElement: retrieveElementFromListState(
                        sendRequestsData,
                        elementId,
                        pageNumber,
                        rowIndex
                      )
                    });
                  }}
                  feedbackSentForElements={successfullySentFeedbackForElements}
                />
              </Paper>
            </Grid>
          </Grid>
        </Grid>

        <ElementDetailsDialog
          open={detailsModalOpen}
          dialogTitle={`Aggiornamento del ${new Date(
            currentlyShowingElement[SEND_REQUEST_ATTRIBUTE.DELIVERY_TIMESTAMP] * 1000
          ).toLocaleDateString('it-it')}: ${currentlyShowingElement[COMMON_ELEMENT_ATTRIBUTE.TITLE]}`}
          element={currentlyShowingElement}
          elementFields={detailsDialogFields}
          renderFieldContent={renderElementFieldContent}
          onClose={this.hideDetailsModal}
        />

        <InstallFeedbackDialog
          key={currentlyShowingElement.id}
          open={feedbackModalOpen}
          isLoading={isSendingFeedback}
          displaySendError={lastFeedbackFailed}
          sendRequest={currentlyShowingElement}
          onSend={(elementId, installStatus, installFeedback) =>
            sendFeedback(elementId, installStatus, installFeedback)
          }
          onClose={this.hideFeedbackModal}
        />
      </>
    );
  }

  downloadPatchFileInNewTab = (elementId, pageNumber) => {
    const sendRequest = retrieveElementFromListState(this.props.sendRequestsData, elementId, pageNumber);
    const installLink = sendRequest[SEND_REQUEST_ATTRIBUTE.INSTALL_LINK];
    // prettier-ignore
    if (installLink != null)
      window.open(installLink, '_blank', 'noopener');
  };

  hideDetailsModal = () => {
    this.setState({ detailsModalOpen: false });
  };

  hideFeedbackModal = () => {
    this.props.resetFailedFeedbackFlag();
    this.setState({ feedbackModalOpen: false });
  };
}

ClientView.displayName = 'ClientView';

const mapStateToProps = state => {
  return {
    sendRequestsData: state.lists[USER_ROLE_STRING[USER_TYPE_ID.CLIENT]].sendRequests,
    successfullySentFeedbackForElements:
      state.views[USER_ROLE_STRING[USER_TYPE_ID.CLIENT]].successfullySentFeedbackForElements,
    isSendingFeedback: state.views[USER_ROLE_STRING[USER_TYPE_ID.CLIENT]].isSendingFeedback,
    lastFeedbackFailed: state.views[USER_ROLE_STRING[USER_TYPE_ID.CLIENT]].lastFeedbackFailed
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      retrieveSendRequestsListPage: retrieveSendRequestsListPageAction,
      startSendRequestsListUpdatesAutoChecking: startSendRequestsListUpdatesAutoCheckingAction,
      stopSendRequestsListUpdatesAutoChecking: stopSendRequestsListUpdatesAutoCheckingAction,
      performNewSearch: performNewSearchAction,
      sendFeedback: sendFeedbackAction,
      resetFailedFeedbackFlag: () => ({ type: CLIENT_ACTION_TYPE.RESET_FAILED_FEEDBACK_FLAG }),
      resetUI: () => ({ type: CLIENT_ACTION_TYPE.RESET_UI })
    },
    dispatch
  );
};

export default withErrorBoundary(
  withStyles(viewStyles)(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(ClientView)
  )
);
