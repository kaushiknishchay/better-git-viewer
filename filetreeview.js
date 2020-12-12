import React, { useEffect, useCallback, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { TREE, walk, readBlob } from 'isomorphic-git';

import { defaultGitOptions } from './git_options';
import Tree from './tree';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    height: 'calc(100vh - 90px)',
    background: '#eceff1',
    maxWidth: '100%',
    margin: 0,
    position: 'relative',
  },
  fileContent: {
    height: '100%',
    padding: theme.spacing(2),
    whiteSpace: 'pre-wrap',
  },
  fileContentGrid: {
    marginLeft: '33.33%',
    minHeight: '100%',
  },
  sidetreeGrid: {
    width: 'calc(33.33% - 16px)',
    position: 'fixed',
    height: 'calc(100% - 90px)',
  },
  sidetree: {
    overflow: 'auto',
    height: '100%',
    padding: theme.spacing(2),
  },
}));

const cache = {};

export default function FileTreeView(props) {
  const [fileTree, updateFileTree] = useState(null);
  const [fileContent, updateFileContent] = useState('');

  useEffect(async () => {
    const tree = await walk({
      ...defaultGitOptions,
      trees: [TREE({ ref: 'HEAD' })],
      cache,
      reduce: async (parent, children) => {
        const node = parent[0] || {};
        const oid = await parent[0].oid();
        const type = await node.type();

        return {
          id:
            node._fullpath === '.'
              ? '<root>'
              : `${type}::${oid}::${node._fullpath}`,
          name: node._fullpath === '.' ? '<root>' : node._fullpath,
          type,
          oid,
          children,
        };
      },
    });

    updateFileTree(tree);

    return () => {};
  }, []);

  const handleFileClick = useCallback(async (event, nodeId = '') => {
    if (!nodeId) return;

    console.log(nodeId);

    const [type, oid, path] = nodeId.split('::');

    if (type != 'blob') return;

    let { blob } = await readBlob({
      ...defaultGitOptions,
      oid,
    });

    updateFileContent(Buffer.from(blob).toString('utf8'));
  }, []);

  const classes = useStyles();

  return (
    <Grid container className={classes.root} spacing={2}>
      <Grid item sm={4} className={classes.sidetreeGrid}>
        <Paper className={classes.sidetree}>
          {fileTree && (
            <Tree tree={fileTree} onTreeItemClick={handleFileClick} />
          )}
        </Paper>
      </Grid>
      <Grid item sm={8} className={classes.fileContentGrid}>
        <Paper>
          {fileContent ? (
            <Typography className={classes.fileContent}>
              {fileContent}
            </Typography>
          ) : (
            <p>Select a file to view content</p>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
}
