import React from 'react';
import PropTypes from 'prop-types';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import TableFooter from '@material-ui/core/TableFooter';

/**
 * @class
 * Table footer which contains pagination controls.
 */
export default class TablePaginationFooter extends React.PureComponent {
  render() {
    const { itemsCount, itemsPerPage, currentPage, onPageChange } = this.props;
    return (
      <TableFooter>
        <TableRow>
          <TablePagination
            count={itemsCount}
            rowsPerPage={itemsPerPage}
            page={currentPage}
            rowsPerPageOptions={[itemsPerPage]}
            labelDisplayedRows={this.displayedRowsLabel}
            onChangePage={(_, pageNumber) => onPageChange(pageNumber)}
          />
        </TableRow>
      </TableFooter>
    );
  }

  displayedRowsLabel = ({ from, to, count }) => `${from}-${to} di ${count} elementi totali`;
}

TablePaginationFooter.propTypes = {
  itemsCount: PropTypes.number.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired
};
