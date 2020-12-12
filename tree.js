import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';

const useStyles = makeStyles({
  root: {
    height: 110,
    flexGrow: 1,
    maxWidth: 400,
  },
});

const renderTree = (nodes, parent = {}) => {
  // console.log({ nodes, parent });
  const parentLabel = parent.name;
  const re = new RegExp(`^(${parentLabel})\/`);
  const nodeLabel = nodes.name.replace(re, '');

  return (
    <TreeItem key={nodes.id} nodeId={nodes.id} label={nodeLabel}>
      {Array.isArray(nodes.children)
        ? nodes.children.map((node) => renderTree(node, nodes))
        : null}
    </TreeItem>
  );
};

export default function Tree(props) {
  const classes = useStyles();

  return (
    <TreeView
      className={classes.root}
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpanded={['<root>']}
      defaultExpandIcon={<ChevronRightIcon />}
      onNodeSelect={props.onTreeItemClick}
    >
      {renderTree(props.tree, {})}
    </TreeView>
  );
}
