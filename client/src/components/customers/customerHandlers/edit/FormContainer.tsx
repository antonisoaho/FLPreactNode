import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CustomerOverview } from '../models/ViewCustomerModel';
import { getSingleCustomerById } from '../../../../apiCalls/apiCustomerCalls';

const FormContainer = () => {
  const { custId } = useParams();
  const [custOverview, setCustOverview] = useState<CustomerOverview>();

  useEffect(() => {
    const getCustomer = async () => {
      const response = await getSingleCustomerById(custId!);
      if (response.success) {
        setCustOverview(response.data);
        console.log('custOverview', custOverview);
      }
    };

    getCustomer();
  }, [custId]);

  return <div>FormContainer</div>;
};

export default FormContainer;
