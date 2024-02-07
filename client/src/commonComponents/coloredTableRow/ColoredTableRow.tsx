import { TableRow, TableRowProps, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';

const ColoredTableRow: React.FC<TableRowProps> = ({ children }) => {
  const theme = useTheme();
  const [bgColor, setBgColor] = useState(theme.palette.mode === 'dark' ? '#303030' : '#f5f5f5');

  useEffect(() => {
    setBgColor(theme.palette.mode === 'dark' ? '#303030' : '#f5f5f5');
  }, [theme.palette.mode]);

  return (
    <TableRow
      sx={{
        backgroundColor: bgColor,
      }}>
      {children}
    </TableRow>
  );
};

export default ColoredTableRow;
