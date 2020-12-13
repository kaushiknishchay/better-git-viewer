import React, { useCallback, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { log } from 'isomorphic-git';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import TabPanel from './tabpanel';
import FileTreeView from './filetreeview';
import { flushDB } from './git_options';
import Home from './home';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: '40px',
  },
}));

export default function App() {
  const [repoUrl, setRepoUrl] = useState();
  const [repoCloned, setRepoCloned] = useState(false);
  const [repoBranch] = useState('master');
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleUrlSubmit = useCallback((url) => {
    setRepoUrl(url);
    setRepoCloned(true);
  }, []);

  useEffect(() => {
    // const commits = await log({
    //   ...defaultGitOptions,
    //   ref: repoBranch,
    // });

    // console.log(commits);

    return () => {
      try {
        flushDB();
      } catch (_) {}
    };
  }, []);

  const classes = useStyles();

  if (!repoCloned) {
    return <Home onSubmit={handleUrlSubmit} />;
  }

  return (
    <div>
      <AppBar position="fixed">
        <Tabs value={value} onChange={handleChange}>
          <Tab label="File Tree" />
          <Tab label="Commits" />
          <Tab label="Search" />
        </Tabs>
      </AppBar>
      <div className={classes.root}>
        <TabPanel value={value} index={0}>
          <FileTreeView />
        </TabPanel>
        <TabPanel value={value} index={1}>
          Item Two
        </TabPanel>
        <TabPanel value={value} index={2}>
          Item Three
        </TabPanel>
      </div>
    </div>
  );
}
