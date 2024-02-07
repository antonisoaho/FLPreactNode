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
  color: 'error' | 'primary' | 'secondary' | 'success' | 'warning';
}

const PromptDialog: React.FC<PromptDialogProps> = ({
  confirm,
  canceled,
  dialogOpen,
  title,
  prompt,
  color,
}) => {
  return (
    <Dialog open={dialogOpen} onClose={canceled}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography>{prompt}</Typography>
      </DialogContent>
      <DialogActions>
        {color === 'error' ? (
          <>
            <Button onClick={canceled}>Avbryt</Button>
            <Button onClick={confirm} variant="contained" color="error">
              Ta bort
            </Button>
          </>
        ) : (
          <>
            <Button onClick={confirm} variant="contained" color={color}>
              Bekräfta
            </Button>

            <Button onClick={canceled}>Avbryt</Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default PromptDialog;
