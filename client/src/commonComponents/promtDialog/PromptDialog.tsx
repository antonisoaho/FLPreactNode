import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import React from 'react';

interface PromptDialogProps {
  confirm: () => void;
  canceled: () => void;
  dialogOpen: boolean;
  title: string;
  prompt: string;
}

const PromptDialog: React.FC<PromptDialogProps> = ({
  confirm,
  canceled,
  dialogOpen,
  title,
  prompt,
}) => {
  return (
    <Dialog open={dialogOpen} onClose={canceled}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography>{prompt}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={canceled}>Avbryt</Button>
        <Button onClick={confirm} variant="contained" color="error">
          Ta bort
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PromptDialog;
