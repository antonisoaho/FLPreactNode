import { useState, useEffect } from 'react';
import { getCustomerNames, getCustomerChildNames } from '../../../../apiCalls/apiCustomerCalls';
import { useSetRecoilState } from 'recoil';
import { snackbarState } from '../../../../recoil/RecoilAtoms';

// NOT IN USE YET
const usePopulateCustomerSelect = (custId: string) => {
  const [selectItems, setSelectItems] = useState<Array<{ label: string; value: string }>>([
    { label: 'Gemensam', value: 'Gemensam' },
  ]);
  const setSnackbarState = useSetRecoilState(snackbarState);

  useEffect(() => {
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

    populateSelectItems();
  }, [custId]);

  return { selectItems, snackbarState };
};

export default usePopulateCustomerSelect;
