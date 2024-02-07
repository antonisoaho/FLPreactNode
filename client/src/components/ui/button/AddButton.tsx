import { MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';

interface AddButtonProps {
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  to?: string;
  isLink: boolean;
  textInput: string;
}

const AddButton: React.FC<AddButtonProps> = ({ onClick, to, isLink, textInput }) => {
  const dynamicProps = isLink
    ? {
        component: Link,
        to: to,
      }
    : {
        onClick,
      };

  return (
    <Tooltip title={textInput} placement="top-start" arrow>
      <Fab
        sx={{
          position: 'fixed',
          right: 24,
          bottom: 24,
        }}
        color="primary"
        aria-label="add"
        {...dynamicProps}>
        <AddIcon />
      </Fab>
    </Tooltip>
  );
};

export default AddButton;
