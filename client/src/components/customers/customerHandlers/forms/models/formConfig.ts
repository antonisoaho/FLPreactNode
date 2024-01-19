import { FC } from 'react';
import CustomerAssetForm from '../CustomerAssetForm';
import CustomerChildForm from '../CustomerChildForm';
import CustomerDetailsForm from '../CustomerDetailsForm';

export type FormConfig = {
  [key: string]: {
    component: FC<any>;
    fields: string[];
    initialValue: { [key: string]: any };
  };
};

export const formConfig: FormConfig = {
  details: {
    component: CustomerDetailsForm,
    fields: ['name', 'yearMonth', 'status'],
    initialValue: { name: '', yearMonth: '', status: '' },
  },
  child: {
    component: CustomerChildForm,
    fields: ['name', 'yearMonth', 'belongs', 'childSupportCounts', 'livesAtHomeToAge'],
    initialValue: {
      name: '',
      yearMonth: '',
      belongs: '',
      childSupportCounts: true,
      livesAtHomeToAge: 20,
    },
  },
  asset: {
    component: CustomerAssetForm,
    fields: [
      'assetType',
      'name',
      'value',
      'stake',
      'mortgageDeed',
      'valueYear',
      'belongs',
      'tax',
      'assessedValue',
      'legalTitleCost',
      'investment',
    ],
    initialValue: {
      assetType: '',
      name: '',
      value: 0,
      stake: 0,
      mortgageDeed: 0,
      valueYear: 0,
      belongs: '',
      tax: 0,
      assessedValue: 0,
      legalTitleCost: 0,
      investment: 0,
    },
  },
};
