import { Box, CircularProgress } from '@mui/material';

const PageLoader = () => {
  return (
    <Box
      sx={{
        maxWidth: 1600,
        minWidth: 800,
        mx: '60px',
        py: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        alignSelf: 'center',
      }}>
      <CircularProgress />
    </Box>
  );
};

export default PageLoader;
