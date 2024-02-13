import React, { Fragment, useState } from 'react';
import { IncomeBase } from '../../models/CustomerFormModels';
import {
  Button,
  Checkbox,
  InputAdornment,
  InputLabel,
  ListItemButton,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
} from '@mui/material';
import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form';
import { CustomFormProps, FormNumberFieldProps, FormSelectProps } from '../../models/FormProps';
import { useGetCustomerNameLabels } from '../../../../hooks/customer/useGetCustomerNameLabels';
import { useSubmitCustomerForm } from '../../../../hooks/customer/useSubmitCustomerForm';
import TableLoader from '../../../ui/tableLoader/TableLoader';

const IncomeBaseForm: React.FC<CustomFormProps> = ({ setFormOpen, formFields }) => {
  const colSpan: number = 4;
  const sendToServer = useSubmitCustomerForm(formFields);
  const { selectItems, isLoading } = useGetCustomerNameLabels(formFields.custId, []);
  const [k10Checked, setK10Checked] = useState<boolean>(false);
  const [companyCarChecked, setCompanyCarChecked] = useState<boolean>(false);

  const details: IncomeBase = {
    belongs: '',
    serviceIncome: undefined,
    ofWhichOwnAB: undefined,
    companyCarBenefit: {
      amount: undefined,
      gross: false,
    },
    soleTraderIncome: undefined,
    taxFree: undefined,
    k10: {
      amount: undefined,
      savedDistribution: undefined,
      salaryBasis: undefined,
      ownershipShare: undefined,
    },
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      item: [details],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'item',
  });

  const onSubmit: SubmitHandler<{
    item: IncomeBase[];
  }> = async (data) => {
    await sendToServer(data.item);
    setFormOpen(false);
    remove();
  };

  if (isLoading)
    return (
      <Table>
        <TableBody>
          <TableLoader colSpan={colSpan} />
        </TableBody>
      </Table>
    );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Table>
        <TableBody>
          {fields.map((detail, index) => (
            <Fragment key={detail.id}>
              <TableRow>
                <TableCell>
                  <TextField
                    {...FormSelectProps}
                    required
                    label="Tillhör"
                    {...register(`item.${index}.belongs`, {
                      required: 'Vänligen välj vem inkomsten tillhör',
                    })}>
                    {selectItems.map((item) => (
                      <MenuItem key={item.value} value={item.value}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </TableCell>
                <TableCell>
                  <TextField
                    required
                    label="Ink. av tjänst"
                    {...register(`item.${index}.serviceIncome`, {
                      required: 'Vänligen mata in inkomst.',
                      min: 0,
                    })}
                    {...FormNumberFieldProps}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    label="Varav eget AB"
                    {...register(`item.${index}.ofWhichOwnAB`, { min: 0 })}
                    {...FormNumberFieldProps}
                  />
                </TableCell>
                <TableCell align="right">
                  <ListItemButton onClick={() => remove(index)}>Ta bort</ListItemButton>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>
                  <TextField
                    label="NE Inkomst"
                    {...register(`item.${index}.soleTraderIncome`, { min: 0 })}
                    {...FormNumberFieldProps}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    label="Skattefritt"
                    {...register(`item.${index}.taxFree`, { min: 0 })}
                    {...FormNumberFieldProps}
                  />
                </TableCell>
                <TableCell>
                  <InputLabel shrink className="form-checkbox-label">
                    K10?
                  </InputLabel>
                  <Checkbox onChange={(e) => setK10Checked(e.target.checked)} />
                </TableCell>
                <TableCell>
                  <InputLabel shrink className="form-checkbox-label">
                    Tjänstebil?
                  </InputLabel>
                  <Checkbox onChange={(e) => setCompanyCarChecked(e.target.checked)} />
                </TableCell>
              </TableRow>
              {k10Checked && (
                <TableRow>
                  <TableCell>
                    <TextField
                      label="Belopp K10"
                      {...register(`item.${index}.k10.amount`, { min: 0 })}
                      {...FormNumberFieldProps}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      label="Sparad utdelning"
                      {...register(`item.${index}.k10.savedDistribution`, { min: 0 })}
                      {...FormNumberFieldProps}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      label="Löneunderlag"
                      {...register(`item.${index}.k10.salaryBasis`, { min: 0 })}
                      {...FormNumberFieldProps}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      label="Ägarandel"
                      {...register(`item.${index}.k10.ownershipShare`, { min: 0, max: 100 })}
                      {...FormNumberFieldProps}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                      }}
                    />
                  </TableCell>
                </TableRow>
              )}
              {companyCarChecked && (
                <TableRow>
                  <TableCell>Tjänstebilsförmåner</TableCell>
                  <TableCell>
                    <TextField
                      label="Förmånsvärde"
                      {...register(`item.${index}.companyCarBenefit.amount`)}
                      {...FormNumberFieldProps}
                    />
                  </TableCell>
                  <TableCell>
                    <InputLabel shrink className="form-checkbox-label">
                      Bruttovärde
                    </InputLabel>
                    <Checkbox {...register(`item.${index}.companyCarBenefit.gross`)} />
                  </TableCell>
                  <TableCell />
                </TableRow>
              )}
            </Fragment>
          ))}
          <TableRow>
            <TableCell>
              <Button disabled={isSubmitting} onClick={() => append(details)}>
                Lägg till
              </Button>
            </TableCell>
            <TableCell colSpan={colSpan - 2} align="right">
              <Button type="submit" variant="contained" disabled={isSubmitting}>
                {!isSubmitting ? 'Spara' : 'Sparar...'}
              </Button>
            </TableCell>
            <TableCell>
              <Button disabled={isSubmitting} onClick={() => setFormOpen(false)}>
                Avbryt
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </form>
  );
};

export default IncomeBaseForm;
