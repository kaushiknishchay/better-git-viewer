import React from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

export default function LinearProgressWithLabel(props) {
  return (
    <div
      style={{
        width: '100%',
      }}
    >
      <Typography>{props.label}</Typography>
      <Box display="flex" alignItems="center">
        <Box width="100%" mr={1}>
          <LinearProgress variant={props.variant} {...props} />
        </Box>
        <Box minWidth={35}>
          <Typography variant="body2" color="textSecondary">
            {`${Math.round(props.value)}%`}
          </Typography>
        </Box>
      </Box>
    </div>
  );
}
