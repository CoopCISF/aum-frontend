/* eslint-disable array-callback-return */
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, withStyles } from '@material-ui/core';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import LogoLoader from '../../components/LogoLoader';
import Navigation from '../../components/Navigation';
import { DESKTOP_DRAWER_WIDTH, NAVIGATION_HIERARCHY } from '../../constants/navigation';
import { ROUTE_PARAM } from '../../constants/routes';
import { performLogoutAction } from '../../redux/actions/auth';
import { requestCurrentUserInfoAction } from '../../redux/actions/user';

const homeStyles = theme => ({
  root: {
    display: 'flex'
  },
  content: {
    [theme.breakpoints.up('md')]: {
      marginLeft: `calc(${DESKTOP_DRAWER_WIDTH})`,
      width: `calc(100% - ${DESKTOP_DRAWER_WIDTH})`
    }
  },
  errorDialog: {
    backgroundColor: theme.palette.error.dark
  },
  errorDialogText: {
    color: 'white'
  },
  dialogButton: {
    color: theme.palette.primary.main
  }
});

/**
 * @class
 * This class represents the home page of the web-app.
 * In the home page the main UI will be loaded once the user data has been fetched from server.
 */
class Home extends Component {
  constructor(props) {
    super(props);

    props.requestCurrentUserInfo(props.accessToken);
  }

  render() {
    const {
      classes,
      accessToken,
      history,
      match,
      user,
      performLogout,
      isSessionExpired,
      requestCurrentUserInfo
    } = this.props;
    
    return (
      <>
        {!user.infoObtained ? (
          user.serverError ? (
            <Dialog classes={{ paper: classes.errorDialog }} disableBackdropClick disableEscapeKeyDown open>
              <DialogContent>
                <DialogContentText className={classes.errorDialogText}>
                  Non è stato possibile ottenere i dati relativi al tuo utente. Riprova o contatta l'amministratore se
                  il problema persiste.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button className={classes.errorDialogText} onClick={() => requestCurrentUserInfo(accessToken)}>
                  Riprova
                </Button>
                <Button className={classes.errorDialogText} onClick={() => performLogout(accessToken)}>
                  Logout
                </Button>
              </DialogActions>
            </Dialog>
          ) : (
            // Displayed while fetching user data from server
            <LogoLoader />
          )
        ) : (
          // Displayed only when user data are obtained successfully
          <div>
            <Navigation match={match} history={history} user={user} onLogout={() => performLogout(accessToken)} />
            <main className={classes.content}>{this.renderContentSubRoutes()}</main>
          </div>
        )}

        {isSessionExpired && (
          <Dialog disableBackdropClick disableEscapeKeyDown open>
            <DialogContent>
              <DialogContentText>La tua sessione è scaduta. Effettua nuovamente il login.</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                className={classes.dialogButton}
                // In this case, token is not passed to the action since logout notification to server isn't needed
                onClick={() => performLogout()}
              >
                Vai alla pagina di login
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </>
    );
  }

  /**
   * Renders Route components which are responsible for displaying the contents of the
   * user role view corresponding to the current URL
   */
  renderContentSubRoutes() {
    const { user, match } = this.props;
    return (
      <Switch>
        {/* Renders the specific routes for the different views */}
        {NAVIGATION_HIERARCHY.map((section, index) => {
          if (user.roles.includes(section.value)) {
            return (
              <Route
                key={index}
                path={`${match.url}${section.routePath}${section.tabs.length > 0 ? ROUTE_PARAM.TAB_INDEX : ''}`}
                component={section.component}
              />
            );
          }
        })}
      </Switch>
    );
  }
}

Home.displayName = 'Home';

const mapStateToProps = state => {
  return {
    accessToken: state.auth.accessToken,
    isSessionExpired: state.auth.isSessionExpired,
    user: state.user
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      performLogout: performLogoutAction,
      requestCurrentUserInfo: requestCurrentUserInfoAction
    },
    dispatch
  );
};

export default withStyles(homeStyles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Home)
);
