import React, { useCallback, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

import ProgressBar from './progress_bar';
import { cloneRepo, flushDB } from './git_options';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    padding: theme.spacing(5),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    width: '100%',
    minHeight: '300px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    justifyContent: 'flex-start',
  },
  button: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
  progressWrapper: {
    width: '100%',
  },
  stdout: {
    display: 'block',
    marginTop: theme.spacing(4),
    padding: theme.spacing(2),
    borderRadius: '2px',
    width: '100%',
    color: '#cfd8dc',
    backgroundColor: '#263238',
    maxHeight: '100px',
    overflow: 'auto',
    whiteSpace: 'pre-wrap',
  },
}));

export default function Home(props) {
  const classes = useStyles();
  const [repoUrl, setRepoUrl] = useState(
    'https://github.com/kaushiknishchay/kaushiknishchay.github.io',
  );
  const [loading, setLoading] = useState(false);
  const [progressLabel, updateLabel] = useState('Cloning repo...');
  const [progressType, setProgressType] = useState('determinate');
  const [progressValue, updateProgressValue] = useState(0);
  const [stdout, updateStdout] = useState('');

  const onProgress = useCallback((event) => {
    if (event.total) {
      updateLabel(`${event.phase} - ${event.loaded} / ${event.total}`);
      setProgressType('determinate');
      updateProgressValue((event.loaded / event.total) * 100);
    } else {
      updateLabel(event.phase);
      setProgressType(undefined);
    }
  }, []);

  const onMessage = useCallback((event) => {
    updateStdout(stdout.concat(`\n`).concat(event));
  }, []);

  const handleChange = useCallback((event) => {
    setRepoUrl(event.target.value);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!repoUrl) return;

    setLoading(true);
    try {
      await flushDB();
    } catch (e) {
      console.log(e);
    }

    await cloneRepo(repoUrl, 'master', onProgress, onMessage);

    props.onSubmit(repoUrl);
  }, []);

  return (
    <Grid container className={classes.root} spacing={2}>
      <Paper className={classes.form}>
        <TextField
          fullWidth
          disabled={loading}
          label="Repository Url (http://...)"
          helperText="Repo must be public so that it can be accessed via CORS proxy."
          variant="outlined"
          value={repoUrl}
          onChange={handleChange}
        />
        <Button
          className={classes.button}
          disabled={loading}
          variant="contained"
          color="secondary"
          onClick={handleSubmit}
        >
          View Repo
        </Button>

        {loading && (
          <div className={classes.progressWrapper}>
            <ProgressBar
              value={progressValue}
              variant={progressType}
              label={progressLabel}
            />
            {stdout.length > 0 && (
              <code className={classes.stdout}>{stdout}</code>
            )}
          </div>
        )}
      </Paper>
    </Grid>
  );
}
