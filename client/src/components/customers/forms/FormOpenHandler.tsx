import { TableRow, TableCell, ListItemButton } from '@mui/material';

type FormCountProps = {
  setFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
  colSpan: number;
};

const FormOpenHandler: React.FC<FormCountProps> = ({ setFormOpen, colSpan }) => {
  return (
    <TableRow>
      <TableCell colSpan={colSpan}>
        <ListItemButton onClick={() => setFormOpen(true)}>Lägg till</ListItemButton>
      </TableCell>
    </TableRow>
  );
};

export default FormOpenHandler;
