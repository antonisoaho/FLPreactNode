import { Link, Outlet } from 'react-router-dom';
import CustomerSidebar from '../sidebar/CustomerSidebar';
import { Box, Button } from '@mui/material';
import { useState } from 'react';

const CustomerEdit = () => {
  console.log('CustomerEdit render');
  const [formOpen, setFormOpen] = useState(false);

  const handleClick = () => {
    setFormOpen(!formOpen);
  };

  return (
    <>
      <CustomerSidebar />
      <Box maxWidth="1600px" marginX="60px" paddingY="20px">
        <Button component={Link} to="forms" variant="contained" onClick={handleClick}>
          Öppna kunddokument
        </Button>
        <Outlet />
      </Box>
    </>
  );
};

export default CustomerEdit;
