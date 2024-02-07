import {
  Table,
  TableBody,
  TableCell,
  TextField,
  MenuItem,
  TableRow,
  ListItemButton,
  Button,
} from '@mui/material';
import React, { Fragment, useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import {
  getCustomerChildNames,
  getCustomerNames,
  updateCustomer,
} from '../../../../../../apiCalls/apiCustomerCalls';
import ColoredTableRow from '../../../../../../commonComponents/coloredTableRow/ColoredTableRow';
import { snackbarState } from '../../../../../../recoil/RecoilAtoms';
import { Investment } from '../models/CustomerFormModels';
import { CustomFormProps, FormTextFieldProps } from '../models/FormProps';
import { removeFormByIndex } from '../models/commonFunctions';
import { timePerspectiveSelect } from '../../variables/variables';

const InvestmentForm: React.FC<CustomFormProps> = ({ submitted, formCount, setFormCount }) => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<Investment[]>();
  const [details, setDetails] = useState<Investment[]>([]);
  const setSnackbarState = useSetRecoilState(snackbarState);
  const { custId } = useParams();
  const [selectItems, setSelectItems] = useState<Array<{ value: string; label: string }>>([
    { value: 'Gemensam', label: 'Gemensam' },
  ]);

  const populateSelectItems = async () => {
    const persons = await getCustomerNames(custId!);
    const children = await getCustomerChildNames(custId!);

    if (persons.success || children.success) {
      setSelectItems((prev) => {
        const currentLabels = prev.map((item) => item.label);
        const newPersons = persons
          .data!.filter((name: string) => !currentLabels.includes(name.split(' ')[0]))
          .map((name: string) => ({ value: name, label: name.split(' ')[0] }));
        const newChildren = children
          .data!.filter((name) => !currentLabels.includes(name))
          .map((name) => ({ value: name, label: name }));

        return [...prev, ...newPersons, ...newChildren];
      });
    } else {
      setSnackbarState({
        open: true,
        message: 'Kunde inte hitta kunders namn, vänligen kontrollera ifyllnad.',
        severity: 'error',
      });
    }
  };

  const onSubmit: SubmitHandler<Investment[]> = async (data) => {
    const response = await updateCustomer({
      field: 'investments',
      _id: custId as string,
      formData: data,
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
        investmentType: '',
        institution: '',
        value: 0,
        timePerspective: '',
      });
    }
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

  const investmentTypeSelect = [
    {
      value: 'Fondkonto',
      label: 'Fondkonto',
    },
    {
      value: 'Fond/aktiedepå',
      label: 'Fond/aktiedepå',
    },
    {
      value: 'ISK',
      label: 'ISK',
    },
    {
      value: 'Kapitalförsäkring',
      label: 'Kapitalförsäkring',
    },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Table>
        <TableBody>
          {details.map((detail, index) => (
            <Fragment key={index}>
              <ColoredTableRow>
                <TableCell colSpan={4}>
                  <TextField
                    className="form-input-select"
                    select
                    required
                    {...FormTextFieldProps}
                    defaultValue={detail.belongs}
                    label="Tillhör"
                    {...register(`${index}.belongs`, {
                      required: 'Vänligen välj ägare av sparande.',
                    })}>
                    {selectItems.map((item) => (
                      <MenuItem key={item.value} value={item.value}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </TableCell>
                <TableCell>
                  <ListItemButton onClick={() => removeDetail(index)}>Ta bort</ListItemButton>
                </TableCell>
              </ColoredTableRow>
              <TableRow>
                <TableCell width="20%">
                  <TextField
                    className="form-input-select"
                    required
                    select
                    label="Kontotyp"
                    defaultValue=""
                    {...FormTextFieldProps}
                    {...register(`${index}.investmentType`, {
                      required: 'Vänligen ange vilken typ av investering.',
                    })}>
                    {investmentTypeSelect.map((item) => (
                      <MenuItem key={item.value} value={item.value}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </TableCell>
                <TableCell width="20%">
                  <TextField
                    className="form-input-field"
                    label="Institut"
                    {...FormTextFieldProps}
                    {...register(`${index}.institution`)}
                  />
                </TableCell>
                <TableCell width="20%">
                  <TextField
                    className="form-input-field"
                    label="Benämning"
                    {...FormTextFieldProps}
                    {...register(`${index}.name`)}
                  />
                </TableCell>
                <TableCell width="20%">
                  <TextField
                    className="form-input-field"
                    label="Insatt"
                    type="number"
                    {...FormTextFieldProps}
                    {...register(`${index}.depositedAmount`, { min: 0 })}
                  />
                </TableCell>
                <TableCell width="20%">
                  <TextField
                    className="form-input-field"
                    label="Saldo"
                    type="number"
                    required
                    {...FormTextFieldProps}
                    {...register(`${index}.value`, {
                      required: 'Vänligen ange värdet på bankmedel.',
                      min: 0,
                    })}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell width="20%">
                  <TextField
                    className="form-input-select"
                    select
                    defaultValue={detail.timePerspective}
                    label="Tidsperspektiv"
                    {...FormTextFieldProps}
                    {...register(`${index}.timePerspective`)}>
                    {timePerspectiveSelect.map((item) => (
                      <MenuItem key={item.value} value={item.value}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </TableCell>
                <TableCell width="20%">
                  <TextField
                    className="form-input-field"
                    label="Spartid (år)"
                    type="number"
                    {...FormTextFieldProps}
                    {...register(`${index}.saveForHowLong`)}
                  />
                </TableCell>
                <TableCell width="20%">
                  <TextField
                    className="form-input-field"
                    label="Riskklass"
                    type="number"
                    {...FormTextFieldProps}
                    {...register(`${index}.riskClass`)}
                  />
                </TableCell>
                <TableCell width="20%">
                  <TextField
                    className="form-input-field"
                    label="Förv. Avgift"
                    type="number"
                    inputProps={{ step: 0.01 }}
                    {...FormTextFieldProps}
                    {...register(`${index}.managementFee`)}
                  />
                </TableCell>
                <TableCell width="20%">
                  <TextField
                    className="form-input-field"
                    label="Skalavgift"
                    type="number"
                    inputProps={{ step: 0.01 }}
                    {...FormTextFieldProps}
                    {...register(`${index}.shellFee`)}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell width="20%">
                  <TextField
                    className="form-input-field"
                    label="Månadsspar"
                    type="number"
                    {...FormTextFieldProps}
                    {...register(`${index}.monthlySavings`)}
                  />
                </TableCell>
                <TableCell width="20%">
                  <TextField
                    className="form-input-field"
                    label="Tilläggsinvestering"
                    type="number"
                    {...FormTextFieldProps}
                    {...register(`${index}.additionalInvestment`)}
                  />
                </TableCell>
                <TableCell width="20%">
                  <TextField
                    className="form-input-field"
                    label="När tillägg"
                    type="number"
                    {...FormTextFieldProps}
                    {...register(`${index}.when`)}
                  />
                </TableCell>
                <TableCell width="20%">
                  <TextField
                    className="form-input-field"
                    label="Tänkt tillväxt"
                    type="number"
                    inputProps={{ step: 0.01 }}
                    {...FormTextFieldProps}
                    {...register(`${index}.projectedGrowth`)}
                  />
                </TableCell>
                <TableCell />
              </TableRow>
            </Fragment>
          ))}
          {formCount > 0 && (
            <TableRow>
              <TableCell colSpan={5} align="right">
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

export default InvestmentForm;
