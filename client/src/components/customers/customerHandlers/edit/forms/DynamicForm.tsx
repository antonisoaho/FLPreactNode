//***** NOT IN USE ****

// import React, { useState, FormEvent, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { Button, Grid, Paper } from '@mui/material';
// import CustomerAssetForm from './CustomerAssetForm';
// import CustomerChildForm from './CustomerChildForm';
// import CustomerDetailsForm from './CustomerDetailsForm';
// import { CustomerFormData } from './models/CustomerFormModels';
// import { formConfig } from './models/formConfig';

// const formComponents: Record<string, React.FC<any>> = {
//   details: CustomerDetailsForm,
//   children: CustomerChildForm,
//   assets: CustomerAssetForm,
// };

// const DynamicFormContainer: React.FC = () => {
//   const { formType } = useParams();

//   const [formData, setFormData] = useState<CustomerFormData[]>([]);

//   useEffect(() => {
//     setFormData([(formConfig[formType!]?.initialValue as CustomerFormData) || {}]);
//   }, [formType]);

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//     console.log('Form submitted:', formData);
//   };

//   const handleAddForm = () => {
//     setFormData((prevData) => [
//       ...prevData,
//       (formConfig[formType!]?.initialValue as CustomerFormData) || {},
//     ]);
//   };

//   const handleRemoveForm = (index: number) => {
//     setFormData((prevData) => [...prevData.slice(0, index), ...prevData.slice(index + 1)]);
//   };

//   const handleFormChange = (index: number, fieldName: string, value: string | boolean | number) => {
//     setFormData((prevData) =>
//       prevData.map((data, i) =>
//         i === index
//           ? {
//               ...data,
//               [fieldName]: value,
//             }
//           : data
//       )
//     );
//   };

//   return (
//     <Grid container alignItems="center" justifyContent="center" direction="column" paddingTop={4}>
//       <Grid item>
//         <Paper
//           sx={{
//             paddingX: 8,
//             paddingY: 5,
//             position: 'relative',
//           }}>
//           {formData.map((formData, index) => {
//             const FormComponent = formComponents[formType!];
//             return (
//               FormComponent && (
//                 <Grid container direction="row" spacing={3} gap={4} marginBottom={4} key={index}>
//                   <FormComponent
//                     formData={formData}
//                     onChange={(fieldName: string, value: string | boolean | number) =>
//                       handleFormChange(index, fieldName, value)
//                     }
//                   />
//                   <Button onClick={() => handleRemoveForm(index)}>Ta bort</Button>
//                 </Grid>
//               )
//             );
//           })}
//           <form onSubmit={handleSubmit}>
//             <Button type="submit" variant="contained">
//               Spara dokument
//             </Button>
//           </form>
//           <Button onClick={handleAddForm}>Lägg till formulär</Button>
//         </Paper>
//       </Grid>
//     </Grid>
//   );
// };

// export default DynamicFormContainer;
