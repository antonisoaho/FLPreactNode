import React, { Fragment, useEffect, useState } from 'react';
import { IncomeBase } from '../models/CustomerFormModels';
import {
  Button,
  Checkbox,
  InputLabel,
  ListItemButton,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
} from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form';
import { getCustomerNames, updateCustomer } from '../../../../../../apiCalls/apiCustomerCalls';
import { useParams } from 'react-router-dom';
import { removeFormByIndex } from '../models/commonFunctions';
import { CustomFormProps, FormTextFieldProps } from '../models/FormProps';
import { useSetRecoilState } from 'recoil';
import { snackbarState } from '../../../../../../recoil/RecoilAtoms';

const IncomeBaseForm: React.FC<CustomFormProps> = ({ submitted, formCount, setFormCount }) => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<IncomeBase[]>();
  const [details, setDetails] = useState<IncomeBase[]>([]);
  const setSnackbarState = useSetRecoilState(snackbarState);
  const { custId } = useParams();
  const [selectItems, setSelectItems] = useState<Array<{ value: string; label: string }>>([]);
  const [companyCarChecked, setCompanyCarChecked] = useState<boolean>(false);
  const [k10Values, setK10Values] = useState<boolean>(false);

  const populateSelectItems = async () => {
    const response = await getCustomerNames(custId!);
    if (response.success) {
      setSelectItems((prev) => {
        const currentLabels = prev.map((item) => item.label);
        const newItems = response
          .data!.filter((name) => !currentLabels.includes(name))
          .map((name) => ({ value: name, label: name }));

        return [...prev, ...newItems];
      });
    } else {
      setSnackbarState({
        open: true,
        message: 'Kunde inte hitta kunders namn, vänligen kontrollera ifyllnad.',
        severity: 'error',
      });
    }
  };

  const onSubmit: SubmitHandler<IncomeBase[]> = async (data) => {
    const response = await updateCustomer({
      field: 'income',
      _id: custId as string,
      formData: data,
      subField: 'base',
    });

    if (response.success) {
      if (submitted) {
        submitted();
        setFormCount(0);
      }
    }
  };

  useEffect(() => {
    const newDetails = [];
    for (let i = 0; i < formCount; i++) {
      newDetails.push({
        belongs: '',
        values: {
          serviceIncome: 0,
          ofWhichOwnAB: 0,
          companyCarBenefit: {
            amount: 0,
            gross: false,
          },
          soleTraderIncome: 0,
          taxFree: 0,
          k10: {
            amount: 0,
            savedDistribution: 0,
            salaryBasis: 0,
            ownershipShare: 0,
          },
        },
      });
    }
    getCustomerNames(custId!);
    setDetails(newDetails);
  }, [formCount]);

  useEffect(() => {
    populateSelectItems();
  }, [custId]);

  const removeDetail = (index: number) => {
    if (details.length > 0) {
      setDetails(removeFormByIndex(details, index));
      setFormCount(formCount - 1);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Table>
        <TableBody>
          {details.map((detail, index) => (
            <Fragment key={index}>
              <TableRow>
                <TableCell>
                  <TextField
                    className="form-input-select"
                    {...FormTextFieldProps}
                    select
                    required
                    defaultValue={detail.belongs}
                    label="Tillhör"
                    {...register(`${index}.belongs`, {
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
                    type="number"
                    label="Ink. av tjänst"
                    {...register(`${index}.values.serviceIncome`, {
                      required: 'Vänligen mata in inkomst.',
                      min: 0,
                    })}
                    {...FormTextFieldProps}
                    className="form-input-field"
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    label="Varav eget AB"
                    {...register(`${index}.values.ofWhichOwnAB`, { min: 0 })}
                    {...FormTextFieldProps}
                    className="form-input-field"
                  />
                </TableCell>
                <TableCell align="right">
                  <ListItemButton onClick={() => removeDetail(index)}>Ta bort</ListItemButton>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>
                  <TextField
                    type="number"
                    label="NE Inkomst"
                    {...register(`${index}.values.soleTraderIncome`, { min: 0 })}
                    {...FormTextFieldProps}
                    className="form-input-field"
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    label="Skattefritt"
                    {...register(`${index}.values.taxFree`, { min: 0 })}
                    {...FormTextFieldProps}
                    className="form-input-field"
                  />
                </TableCell>
                <TableCell>
                  <InputLabel shrink className="form-checkbox-label">
                    K10?
                  </InputLabel>
                  <Checkbox onChange={(e) => setK10Values(e.target.checked)} />
                </TableCell>
                <TableCell>
                  <InputLabel shrink className="form-checkbox-label">
                    Tjänstebil?
                  </InputLabel>
                  <Checkbox onChange={(e) => setCompanyCarChecked(e.target.checked)} />
                </TableCell>
              </TableRow>
              {k10Values && (
                <TableRow>
                  <TableCell>
                    <TextField
                      type="number"
                      label="Belopp K10"
                      {...register(`${index}.values.k10.amount`, { min: 0 })}
                      {...FormTextFieldProps}
                      className="form-input-field"
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      label="Sparad fördelning"
                      {...register(`${index}.values.k10.savedDistribution`, { min: 0 })}
                      {...FormTextFieldProps}
                      className="form-input-field"
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      label="Lönebas"
                      {...register(`${index}.values.k10.salaryBasis`, { min: 0 })}
                      {...FormTextFieldProps}
                      className="form-input-field"
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      label="Ägarandel"
                      {...register(`${index}.values.k10.ownershipShare`, { min: 0, max: 100 })}
                      {...FormTextFieldProps}
                      className="form-input-field"
                    />
                  </TableCell>
                </TableRow>
              )}
              {companyCarChecked && (
                <TableRow>
                  <TableCell>Tjänstebilsförmåner</TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      label="Förmånsvärde"
                      {...register(`${index}.values.companyCarBenefit.amount`)}
                      {...FormTextFieldProps}
                      className="form-input-field"
                    />
                  </TableCell>
                  <TableCell>
                    <InputLabel shrink className="form-checkbox-label">
                      Bruttovärde
                    </InputLabel>
                    <Checkbox {...register(`${index}.values.companyCarBenefit.gross`)} />
                  </TableCell>
                  <TableCell />
                </TableRow>
              )}
            </Fragment>
          ))}
          {formCount > 0 && (
            <TableRow>
              <TableCell colSpan={4} align="right">
                <Button type="submit" disabled={isSubmitting}>
                  {!isSubmitting ? 'Spara' : 'Sparar...'}
                </Button>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </form>
  );
};

export default IncomeBaseForm;
