import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import React from 'react';

interface CustomerDeleteProps {
  deleteConfirm: () => void;
  deleteCanceled: () => void;
  deleteDialogOpen: boolean;
}

const CustomerDeleteDialog: React.FC<CustomerDeleteProps> = ({
  deleteCanceled,
  deleteConfirm,
  deleteDialogOpen,
}) => {
  return (
    <Dialog open={deleteDialogOpen} onClose={deleteCanceled}>
      <DialogTitle>Radera kund</DialogTitle>
      <DialogContent>
        <Typography>Är du säker på att du vill ta bort kunden?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={deleteCanceled}>Avbryt</Button>
        <Button onClick={deleteConfirm} variant="contained" color="error">
          Ta bort
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomerDeleteDialog;
