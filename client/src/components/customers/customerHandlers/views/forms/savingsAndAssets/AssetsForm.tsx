import {
  Table,
  TableBody,
  TableCell,
  TextField,
  MenuItem,
  ListItemButton,
  TableRow,
  Button,
} from '@mui/material';
import React, { Fragment, useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import {
  getCustomerNames,
  getCustomerChildNames,
  updateCustomer,
} from '../../../../../../apiCalls/apiCustomerCalls';
import ColoredTableRow from '../../../../../../commonComponents/coloredTableRow/ColoredTableRow';
import { snackbarState } from '../../../../../../recoil/RecoilAtoms';
import { Assets } from '../models/CustomerFormModels';
import { CustomFormProps, FormTextFieldProps } from '../models/FormProps';
import { removeFormByIndex } from '../models/commonFunctions';
import { DatePicker } from '@mui/x-date-pickers';

const AssetsForm: React.FC<CustomFormProps> = ({ submitted, formCount, setFormCount }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm<Assets[]>();
  const [details, setDetails] = useState<Assets[]>([]);
  const setSnackbarState = useSetRecoilState(snackbarState);
  const { custId } = useParams();
  const [selectItems, setSelectItems] = useState<Array<{ value: string; label: string }>>([
    { value: 'Gemensam', label: 'Gemensam' },
  ]);
  const colSpan: number = 5;

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

  const onSubmit: SubmitHandler<Assets[]> = async (data) => {
    const response = await updateCustomer({
      field: 'assets',
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

  const AssetsTypeSelect = [
    {
      value: 'Bostad',
      label: 'Bostad',
    },
    {
      value: 'Fastighet',
      label: 'Fastighet',
    },
    {
      value: 'Skog',
      label: 'Skog',
    },
    {
      value: 'Fordon',
      label: 'Fordon',
    },
    {
      value: 'Företag',
      label: 'Företag',
    },
    {
      value: 'Antikviteter',
      label: 'Antikviteter',
    },
    {
      value: 'Övrigt',
      label: 'Övrigt',
    },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Table>
        <TableBody>
          {details.map((detail, index) => (
            <Fragment key={index}>
              <ColoredTableRow>
                <TableCell colSpan={colSpan - 1}>
                  <TextField
                    className="form-input-select"
                    select
                    required
                    {...FormTextFieldProps}
                    defaultValue={detail.belongs}
                    label="Tillhör"
                    {...register(`${index}.belongs`, {
                      required: 'Vänligen välj ägare av egendom.',
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
                    label="Tillgångstyp"
                    {...FormTextFieldProps}
                    {...register(`${index}.assetType`, {
                      required: 'Vänligen ange vilken typ av investering.',
                    })}>
                    {AssetsTypeSelect.map((item) => (
                      <MenuItem key={item.value} value={item.value}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </TextField>
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
                    type="Number"
                    label="Värde"
                    required
                    {...FormTextFieldProps}
                    {...register(`${index}.value`, { min: 0 })}
                  />
                </TableCell>
                <TableCell width="20%">
                  <TextField
                    className="form-input-field"
                    label="Insats"
                    type="number"
                    {...FormTextFieldProps}
                    {...register(`${index}.stake`, { min: 0 })}
                  />
                </TableCell>
                <TableCell width="20%">
                  <TextField
                    className="form-input-field"
                    label="Pantbrev"
                    type="number"
                    {...FormTextFieldProps}
                    {...register(`${index}.mortgageDeed`, { min: 0 })}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell width="20%">
                  <DatePicker
                    className="form-input-field"
                    slotProps={{ textField: { ...FormTextFieldProps } }}
                    label="Värderingsår"
                    views={['year']}
                    {...register(`${index}.valueYear`, { max: new Date().getFullYear() })}
                    onChange={(date) => {
                      const newDate = date as Date;
                      const newDateValue = newDate.getFullYear();
                      setValue(`${index}.valueYear`, newDateValue);
                    }}
                  />
                </TableCell>
                <TableCell width="20%">
                  <TextField
                    className="form-input-field"
                    label="Skatt"
                    type="number"
                    inputProps={{ step: 0.01 }}
                    {...FormTextFieldProps}
                    {...register(`${index}.tax`, { min: 0, max: 100 })}
                  />
                </TableCell>
                <TableCell width="20%">
                  <TextField
                    className="form-input-field"
                    label="Taxeringsvärde"
                    type="number"
                    {...FormTextFieldProps}
                    {...register(`${index}.assessedValue`, { min: 0 })}
                  />
                </TableCell>
                <TableCell width="20%">
                  <TextField
                    className="form-input-field"
                    label="Rot"
                    type="number"
                    {...FormTextFieldProps}
                    {...register(`${index}.base`)}
                  />
                </TableCell>
                <TableCell />
              </TableRow>
            </Fragment>
          ))}
          {formCount > 0 && (
            <TableRow>
              <TableCell colSpan={colSpan} align="right">
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

export default AssetsForm;
