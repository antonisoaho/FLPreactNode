import { TableCell, Box, Table, TableHead, TableRow, TableBody } from '@mui/material';
import React from 'react';
import { DateFields } from '../../../../../../../apiCalls/models/ApiModel';
import { ExpensesBase } from '../../../forms/models/CustomerFormModels';
import ColoredTableRow from '../../../../../../../commonComponents/coloredTableRow/ColoredTableRow';

interface RowProps {
  fields: [ExpensesBase & DateFields];
  persons: string[];
}

const BaseExpenseRow: React.FC<RowProps> = ({ fields, persons }) => {
  return (
    <TableRow>
      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
        <Box sx={{ margin: 1 }}>
          <Table size="small" aria-label="more-info">
            {fields?.map((exp) => (
              <React.Fragment key={exp._id}>
                <TableHead>
                  <ColoredTableRow>
                    <TableCell>Utgiftstyp</TableCell>
                    <TableCell>Kartlaggt</TableCell>
                    {persons.map((person) => (
                      <React.Fragment key={person + 'header'}>
                        <TableCell>{person.split(' ')[0] + ' pensionsålder'}</TableCell>
                        <TableCell>{person.split(' ')[0] + ' aktivslut ålder'}</TableCell>
                      </React.Fragment>
                    ))}
                    {persons.length === 1 && (
                      <React.Fragment key={persons + 'headerStats'}>
                        <TableCell />
                        <TableCell />
                      </React.Fragment>
                    )}
                  </ColoredTableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{exp.values?.expenseType}</TableCell>
                    <TableCell>{exp.values?.mapped?.toLocaleString() || '-'}</TableCell>
                    {persons.map((person, idx) => (
                      <React.Fragment key={person + 'header'}>
                        <TableCell>{exp.values?.pension?.[idx] || '-'}</TableCell>
                        <TableCell>{exp.values?.activeEnd?.[idx] || '-'}</TableCell>
                      </React.Fragment>
                    ))}
                    {persons.length === 1 && (
                      <React.Fragment key={persons + 'headerStats'}>
                        <TableCell />
                        <TableCell />
                      </React.Fragment>
                    )}
                  </TableRow>
                </TableBody>
                <TableHead>
                  <TableRow>
                    {persons.map((person) => (
                      <React.Fragment key={person + 'header'}>
                        <TableCell>{person.split(' ')[0] + ' pension'}</TableCell>
                        <TableCell>{person.split(' ')[0] + ' aktiv slut'}</TableCell>
                        <TableCell>{person.split(' ')[0] + ' dödsfall'}</TableCell>
                      </React.Fragment>
                    ))}
                    {persons.length === 1 && (
                      <React.Fragment key={persons + 'placeholderHeader'}>
                        <TableCell />
                        <TableCell />
                        <TableCell />
                      </React.Fragment>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    {persons.map((person, idx) => (
                      <React.Fragment key={person + 'values'}>
                        <TableCell>{exp.values?.difPension?.[idx] || 0}</TableCell>
                        <TableCell>{exp.values?.difActiveEnd?.[idx] || 0}</TableCell>
                        <TableCell>{exp.values?.difDeath?.[idx] || 0}</TableCell>
                      </React.Fragment>
                    ))}
                    {persons.length === 1 && (
                      <React.Fragment key={persons + 'placeholderValues'}>
                        <TableCell />
                        <TableCell />
                        <TableCell />
                      </React.Fragment>
                    )}
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

export default BaseExpenseRow;
