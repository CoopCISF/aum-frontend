import React, { Component } from 'react';
import { Button } from 'react-materialize';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { attemptLogout } from '../../actions/auth';

/**
 * @class
 * This class represents the home page of the webapp.
 * In the home page the main UI will be loaded, so we will load
 * components responsible for loading new data and inserting new data.
 */
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.onLogout = this.onLogout.bind(this);
  }

  static getDerivedStateFromProps(newProps, state) {
    return {
      accessToken: newProps.accessToken
    };
  }

  render() {
    return (
      <div>
        <h1>Home</h1>
        {this.state.accessToken ? (
          <h5>Logged in with access token: {this.state.accessToken}</h5>
        ) : null}
        <Button onClick={this.onLogout}>LOGOUT</Button>
      </div>
    );
  }

  onLogout() {
    this.props.attemptLogout(this.state.accessToken);
  }
}

const mapStateToProps = state => {
  return {
    accessToken: state.auth.accessToken
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      attemptLogout
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);