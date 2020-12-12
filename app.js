import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { clone, log } from 'isomorphic-git';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import TabPanel from './tabpanel';
import FileTreeView from './filetreeview';
import { defaultGitOptions } from './git_options';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: '40px',
  },
}));

export default function App() {
  const [repoBranch] = useState('master');
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(async () => {
    await clone({
      ...defaultGitOptions,
      url: 'https://github.com/kaushiknishchay/React-Native-Restaurant-App',
      ref: repoBranch,
    });

    let commits = await log({
      ...defaultGitOptions,
      ref: repoBranch,
    });
    console.log(commits);

    return () => {};
  }, []);
  const classes = useStyles();

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
