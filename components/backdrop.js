import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import { Box, Typography } from '@mui/material';
function Backdroploading() {
  return (
    <div>
      
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={true}
        // onClick={handleClose}
        
      >
        <Box  textAlign={"center"}>
        <CircularProgress color="inherit" />
        <Typography>Processing Order</Typography>
        </Box>
      </Backdrop>
    </div>
  )
}

export default Backdroploading