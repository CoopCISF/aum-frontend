import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

/**
 * @class
 * This class is responsible of displaying inner tabs for
 * each member.
 */
export default class InnerTabs extends Component {
  constructor(props) {
    super(props);

    this.onTabClicked = this.onTabClicked.bind(this);
  }

  render() {
    const { tabs, match } = this.props;
    return (
      <Tabs value={match.params.value} scrollable scrollButtons="auto">
        {tabs.map((tab, index) => {
          return (
            <Tab
              key={index}
              value={tab.value}
              label={tab.label}
              onClick={() => this.onTabClicked(tab.value)}
            />
          );
        })}
      </Tabs>
    );
  }

  onTabClicked(value) {
    const { history, prevUrl } = this.props;

    history.push(`${prevUrl}/${value}`);
  }
}

InnerTabs.propTypes = {
  prevUrl: PropTypes.string.isRequired,
  tabs: PropTypes.array.isRequired
};