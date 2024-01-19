import React, { useState, FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Grid, Paper } from '@mui/material';
import CustomerAssetForm from './CustomerAssetForm';
import CustomerChildForm from './CustomerChildForm';
import CustomerDetailsForm from './CustomerDetailsForm';
import { CustomerFormData } from './models/CustomerFormModels';
import { formConfig } from './models/formConfig';

const formComponents: Record<string, React.FC<any>> = {
  details: CustomerDetailsForm,
  children: CustomerChildForm,
  assets: CustomerAssetForm,
};

const DynamicFormContainer: React.FC = () => {
  const { formType } = useParams();

  const [formData, setFormData] = useState<CustomerFormData[]>([
    (formConfig[formType!]?.initialValue as CustomerFormData) || {},
  ]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handleAddForm = () => {
    setFormData((prevData) => [
      ...prevData,
      (formConfig[formType!]?.initialValue as CustomerFormData) || {},
    ]);
  };

  const handleRemoveForm = (index: number) => {
    setFormData((prevData) => [...prevData.slice(0, index), ...prevData.slice(index + 1)]);
  };

  const handleFormChange = (index: number, fieldName: string, value: string | boolean | number) => {
    setFormData((prevData) =>
      prevData.map((data, i) =>
        i === index
          ? {
              ...data,
              [fieldName]: value,
            }
          : data
      )
    );
  };

  return (
    <Grid container alignItems="center" justifyContent="center" direction="column" paddingTop={4}>
      <Grid item>
        <Paper
          sx={{
            paddingX: 8,
            paddingY: 5,
            position: 'relative',
          }}>
          {formData.map((formData, index) => {
            const FormComponent = formComponents[formType!];
            return (
              FormComponent && (
                <Grid container direction="row" spacing={3} gap={4} marginBottom={4} key={index}>
                  <FormComponent
                    formData={formData}
                    onChange={(fieldName: string, value: string | boolean | number) =>
                      handleFormChange(index, fieldName, value)
                    }
                  />
                  <Button onClick={() => handleRemoveForm(index)}>Remove Form</Button>
                </Grid>
              )
            );
          })}
          <form onSubmit={handleSubmit}>
            <Button type="submit" variant="contained">
              Skapa dokument för kund
            </Button>
          </form>
          <Button onClick={handleAddForm}>Add Form</Button>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default DynamicFormContainer;
