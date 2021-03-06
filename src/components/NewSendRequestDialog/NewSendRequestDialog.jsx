import { DialogTitle, withStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import SelectField from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Select from 'react-select';
import ResponsiveDialog from '../../components/ResponsiveDialog';
import { INSTALL_TYPE, INSTALL_TYPE_LABEL } from '../../constants/elements';
import { Control, Menu, MultiValue, NoOptionsMessage, ValueContainer } from '../Select';
import { selectDialogStyles } from '../../views/styles';

const selectComponents = {
  NoOptionsMessage,
  Control,
  ValueContainer,
  MultiValue,
  Menu
};

const initialDialogState = {
  title: '',
  description: '',
  installationType: '',
  destClients: [],
  branch: '',
  commits: [],
  components: ''
};

class NewSendRequestDialog extends Component {
  constructor(props) {
    super(props);

    this.state = initialDialogState;
  }

  render() {
    const {
      classes,
      isLoadingClients,
      allClients,
      isLoadingBranches,
      allBranches,
      isLoadingCommits,
      allCommits,
      isLoading,
      isFailed,
      isSuccessful,
      ...otherProps
    } = this.props;
    const { title, description, installationType, destClients, branch, commits, components } = this.state;

    if (!isLoading && !isFailed && isSuccessful) this.onDialogClose();

    return (
      <ResponsiveDialog {...otherProps} isLoading={isLoading && !isFailed} scroll="body">
        <DialogTitle>Inserisci una nuova richiesta di invio</DialogTitle>
        <DialogContent classes={{ root: classes.dialogContent }}>
          <Grid container spacing={16}>
            <Grid item xs={12}>
              <TextField
                label="Titolo"
                margin="normal"
                variant="outlined"
                fullWidth
                value={title}
                onChange={event => this.onInputChanged('title', event)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Descrizione"
                margin="normal"
                variant="outlined"
                fullWidth
                value={description}
                onChange={event => this.onInputChanged('description', event)}
              />
            </Grid>
            <Grid item xs={12}>
              <Select
                classes={classes}
                textFieldProps={{
                  label: 'Cliente/i',
                  InputLabelProps: {
                    shrink: true
                  }
                }}
                components={selectComponents}
                options={allClients}
                placeholder="Seleziona uno o più clienti"
                value={destClients}
                onChange={this.onSelectInputChanged('destClients')}
                isMulti
                isLoading={isLoadingClients}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Select
                classes={classes}
                textFieldProps={{
                  label: 'Branch',
                  InputLabelProps: {
                    shrink: true
                  }
                }}
                options={allBranches}
                components={selectComponents}
                value={branch}
                onChange={this.onSelectInputChanged('branch')}
                placeholder="Seleziona un branch"
                isClearable
                isLoading={isLoadingBranches}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Select
                classes={classes}
                textFieldProps={{
                  label: 'Commits',
                  InputLabelProps: {
                    shrink: true
                  }
                }}
                components={selectComponents}
                options={allCommits}
                placeholder="Seleziona uno o più commit"
                value={commits}
                onChange={this.onSelectInputChanged('commits')}
                isMulti
                isLoading={isLoadingCommits}
              />
            </Grid>
            <Grid item xs={12} md={9}>
              <TextField
                label="Componenti"
                margin="normal"
                variant="outlined"
                fullWidth
                value={components}
                onChange={event => this.onInputChanged('components', event)}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl variant="outlined" fullWidth style={{ marginTop: 16 }}>
                <InputLabel htmlFor="installationType">Tipo installazione</InputLabel>
                <SelectField
                  value={installationType}
                  onChange={event => this.onInputChanged('installationType', event)}
                  input={<OutlinedInput id="installationType" labelWidth={128 /* Hardcoded value */} />}
                >
                  {/* Here we will make a server call to get all the installtion types */}
                  <MenuItem value={INSTALL_TYPE.DURING_EXECUTION}>{INSTALL_TYPE_LABEL.DURING_EXECUTION}</MenuItem>
                  <MenuItem value={INSTALL_TYPE.NEEDS_SHUTDOWN}>{INSTALL_TYPE_LABEL.NEEDS_SHUTDOWN}</MenuItem>
                </SelectField>
              </FormControl>
            </Grid>
            {isFailed && (
              <Grid item xs={12}>
                <Typography variant="subtitle1" color="error" gutterBottom>
                  Errore durante l'aggiunta di una nuova richiesta di invio, riprova.
                </Typography>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={this.onDialogClose}>
            Annulla
          </Button>
          <Button color="primary" onClick={this.onDialogSend}>
            Invia
          </Button>
        </DialogActions>
      </ResponsiveDialog>
    );
  }

  onDialogClose = () => {
    const { onDialogClose } = this.props;

    this.setState(initialDialogState);

    onDialogClose();
  };

  onDialogSend = () => {
    const { onDialogSend } = this.props;
    const { title, description, installationType, destClients, branch, commits, components } = this.state;

    onDialogSend({
      title,
      description,
      install_type: installationType,
      dest_clients: destClients.map(element => element.value),
      branch: branch.value,
      commits: commits.map(element => element.value),
      components
    });
  };

  onInputChanged = (name, event) => {
    this.setState({
      [name]: event.target.value
    });
  };

  onSelectInputChanged = name => value => {
    this.setState({
      [name]: value
    });
  };
}

NewSendRequestDialog.displayName = 'NewSendRequestDialog';
NewSendRequestDialog.propTypes = {
  isLoadingClients: PropTypes.bool.isRequired,
  allClients: PropTypes.array.isRequired,
  isLoadingBranches: PropTypes.bool.isRequired,
  allBranches: PropTypes.array.isRequired,
  isLoadingCommits: PropTypes.bool.isRequired,
  allCommits: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isSuccessful: PropTypes.bool.isRequired,
  isFailed: PropTypes.bool.isRequired,
  onDialogClose: PropTypes.func.isRequired,
  onDialogSend: PropTypes.func.isRequired
};

export default withStyles(selectDialogStyles)(NewSendRequestDialog);
