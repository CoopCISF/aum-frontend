import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import ResponsiveDialog from '../../components/ResponsiveDialog';
import Typography from '@material-ui/core/Typography';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';

const buttonToTheLeftStyle = {
  marginRight: 'auto'
};

/**
 * @class
 * Dialog component that is used to display the details about a particular element (an object passed via props).
 * You must specify the fields of that element via the elementFields array.
 * Fields definitions are objects structured as follows:
 *   { key: '[the field accessor]', label: '[the printable name of the field]' }
 * The function renderFieldContent, given the value and the key of the field, must return a printable
 * representation of the field (which can be a string or a JSX snippet).
 */
export default class ElementDetailsDialog extends React.Component {
  render() {
    const {
      element,
      elementFields,
      renderFieldContent,
      onClose,
      dialogTitle,
      renderExtraActions,
      backButtonToTheLeft,
      ...otherProps
    } = this.props;

    return (
      <ResponsiveDialog {...otherProps}>
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent>
          <Grid container spacing={16}>
            {elementFields.map(field => (
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>
                  {field.label}
                </Typography>
                <Typography variant="body1">{renderFieldContent(element[field.key], field.key)}</Typography>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary" style={backButtonToTheLeft ? buttonToTheLeftStyle : undefined}>
            Indietro
          </Button>
          {renderExtraActions != null ? renderExtraActions() : null}
        </DialogActions>
      </ResponsiveDialog>
    );
  }
}

ElementDetailsDialog.defaultProps = {
  backButtonToTheLeft: false
};

ElementDetailsDialog.propTypes = {
  dialogTitle: PropTypes.string.isRequired,
  element: PropTypes.object.isRequired,
  elementFields: PropTypes.array.isRequired,
  renderFieldContent: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  backButtonToTheLeft: PropTypes.bool,
  renderExtraActions: PropTypes.func
};