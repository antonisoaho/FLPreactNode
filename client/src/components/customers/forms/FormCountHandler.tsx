import { TableRow, TableCell, ListItemButton } from '@mui/material';

type FormCountProps = {
  formCount: number;
  setFormCount: React.Dispatch<React.SetStateAction<number>>;
  colSpan: number;
};

const FormCountHandler: React.FC<FormCountProps> = ({ formCount, setFormCount, colSpan }) => {
  return (
    <TableRow>
      <TableCell colSpan={colSpan}>
        <ListItemButton onClick={() => setFormCount(formCount + 1)}>Lägg till</ListItemButton>
      </TableCell>
    </TableRow>
  );
};

export default FormCountHandler;
