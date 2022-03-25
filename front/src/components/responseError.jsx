import React from 'react'
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

const ResponseError = ({error, showError}) => {
  return  showError && (
    <Stack sx={{ width: '100%' }} spacing={2}>
    <Alert severity="error">{error}</Alert>
    </Stack>
  )
}

export default ResponseError