import { useMutation, useQueryClient } from 'react-query';
import { updateCustomer } from '../services/api/apiCustomerCalls';
import { FormFields } from '../components/customers/models/FormProps';
import { CustomerFormData } from '../components/customers/models/CustomerFormModels';

export const useSubmitCustomerForm = (formFields: FormFields) => {
  const queryClient = useQueryClient();

  const { mutateAsync: sendToServer } = useMutation({
    mutationFn: (data: CustomerFormData[]) => updateCustomer({ ...formFields, formData: data }),

    onSuccess: () => {
      queryClient.invalidateQueries(['customer']);
      console.log('formFields', formFields);
    },
  });

  return sendToServer;
};
