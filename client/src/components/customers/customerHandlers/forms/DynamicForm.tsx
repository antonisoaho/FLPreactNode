import React, { useState, FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Grid, Paper, Typography } from '@mui/material';
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
  console.log('dynamicForm render');

  const { formType } = useParams();
  console.log('formType', formType);

  const [formData, setFormData] = useState<CustomerFormData>(
    (formConfig[formType!]?.initialValue as CustomerFormData) || {}
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Perform your submit logic here
  };

  const FormComponent = formComponents[formType!];
  console.log('FormComponent', FormComponent);
  return (
    <Grid container alignItems="center" justifyContent="center" direction="column" paddingTop={4}>
      <Grid item>
        <Paper
          sx={{
            paddingX: 8,
            paddingY: 5,
            position: 'relative',
          }}>
          {FormComponent && (
            <FormComponent
              formData={formData}
              onChange={(fieldName: string, value: string | boolean | number) =>
                setFormData((prevData) => ({
                  ...prevData,
                  [fieldName]: value,
                }))
              }
            />
          )}
          <form onSubmit={handleSubmit}>
            <Button type="submit" variant="contained">
              Skapa dokument för kund
            </Button>
          </form>
          <Typography variant="h6" sx={{ marginTop: 2 }}>
            Välj formulärtyp:
          </Typography>
          <Grid container spacing={2}>
            {Object.keys(formComponents).map((type) => (
              <Grid item key={type}>
                <Button
                  variant="outlined"
                  onClick={() =>
                    setFormData((formConfig[type]?.initialValue as CustomerFormData) || {})
                  }
                  sx={{
                    textTransform: 'capitalize',
                    fontWeight: type === formType ? 'bold' : 'normal',
                  }}>
                  {type}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default DynamicFormContainer;
