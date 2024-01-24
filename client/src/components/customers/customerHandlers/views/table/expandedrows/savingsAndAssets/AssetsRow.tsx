import { TableCell, Box, Table, TableHead, TableRow, TableBody } from '@mui/material';
import React from 'react';
import { DateFields } from '../../../../../../../apiCalls/models/ApiModel';
import { Assets } from '../../../../edit/forms/models/CustomerFormModels';
import ColoredTableRow from '../../../../../../../commonComponents/coloredTableRow/ColoredTableRow';

interface RowProps {
  fields: [Assets & DateFields];
}

const AssetsRow: React.FC<RowProps> = ({ fields }) => {
  fields.sort((a, b) => {
    if (a.belongs === 'Gemensamt') return -1;
    if (b.belongs === 'Gemensamt') return 1;

    return a.belongs! > b.belongs! ? 1 : -1;
  });

  return (
    <TableRow>
      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
        <Box sx={{ margin: 1 }}>
          <Table size="small" aria-label="more-info">
            {fields!.map((f) => (
              <React.Fragment key={f._id}>
                <TableHead>
                  <ColoredTableRow>
                    <TableCell>{f.belongs}</TableCell>
                    <TableCell />
                    <TableCell />
                    <TableCell />
                    <TableCell align="right">Uppdaterad:</TableCell>
                    <TableCell>{new Date(f.updatedAt!).toLocaleDateString()}</TableCell>
                  </ColoredTableRow>
                  <TableRow>
                    <TableCell>Tillgångstyp</TableCell>
                    <TableCell>Benämning/ID</TableCell>
                    <TableCell>Värde</TableCell>
                    <TableCell>Insats</TableCell>
                    <TableCell>Pantbrev</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{f.assetType || '-'}</TableCell>
                    <TableCell>{f.name || f._id}</TableCell>
                    <TableCell>{f.name || f._id}</TableCell>
                    <TableCell>{f.value?.toLocaleString() || '-'}</TableCell>
                    <TableCell>{f.stake?.toLocaleString() || '-'}</TableCell>
                    <TableCell>{f.mortgageDeed?.toLocaleString() || '-'}</TableCell>
                  </TableRow>
                </TableBody>
                <TableHead>
                  <TableRow>
                    <TableCell>Värderingsår</TableCell>
                    <TableCell>Skatt</TableCell>
                    <TableCell>Taxeringsvärde</TableCell>
                    <TableCell />
                    <TableCell>Rot</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{f.valueYear?.toLocaleString() || '-'}</TableCell>
                    <TableCell>{f.tax || '-'}</TableCell>
                    <TableCell>{f.assessedValue?.toLocaleString() || '-'}</TableCell>
                    <TableCell />
                    <TableCell>{f.base?.toLocaleString() || '-'}</TableCell>
                  </TableRow>
                </TableBody>
              </React.Fragment>
            ))}
          </Table>
        </Box>
      </TableCell>
    </TableRow>
  );
};

export default AssetsRow;
