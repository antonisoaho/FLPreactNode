import { Link, Outlet } from 'react-router-dom';
import CustomerSidebar from '../sidebar/CustomerSidebar';
import { Button } from '@mui/material';
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
      <Button component={Link} to="forms" variant="contained" onClick={handleClick}>
        Öppna kunddokument
      </Button>
      <Outlet />
    </>
  );
};

export default CustomerEdit;
