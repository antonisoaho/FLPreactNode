import { IconButton, TableCell } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useState } from 'react';
import ColoredTableRow from '../../ui/coloredTableRow/ColoredTableRow';

interface RowProps {
  fieldName: string;
  fieldLength: number;
  children: React.ReactNode;
}

const NestedRow: React.FC<RowProps> = ({ fieldName, fieldLength, children }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <ColoredTableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell
          style={{
            width: 'fit-content',
            whiteSpace: 'nowrap',
            maxWidth: '10px',
            padding: 0,
            paddingLeft: '32px',
          }}>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row" sx={{ fontStyle: 'italic', paddingLeft: '16px' }}>
          {fieldName}
        </TableCell>

        <TableCell align="right">{fieldLength}</TableCell>
        <TableCell />
      </ColoredTableRow>
      {open && children}
    </>
  );
};

export default NestedRow;
