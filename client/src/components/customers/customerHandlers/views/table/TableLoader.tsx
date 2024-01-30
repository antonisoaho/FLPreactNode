import { TableRow, TableCell, CircularProgress } from '@mui/material';

type LoaderProps = {
  colSpan: number;
};

const TableLoader: React.FC<LoaderProps> = ({ colSpan }) => {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} sx={{ textAlign: 'center' }}>
        <CircularProgress />
      </TableCell>
    </TableRow>
  );
};

export default TableLoader;
