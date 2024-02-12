export const qualifyingPeriodSickness = [
  {
    value: -1,
    label: 'Ingen',
  },
  {
    value: 0,
    label: 'Sjukersättning',
  },
  {
    value: 1,
    label: '1 Månad',
  },
  {
    value: 3,
    label: '3 Månader',
  },
  {
    value: 12,
    label: '12 Månader',
  },
  {
    value: 18,
    label: '18 Månader',
  },
  {
    value: 36,
    label: '36 Månader',
  },
];

export const compensationPeriodSickness = [
  {
    value: 0,
    label: 'Sjukersättning',
  },
  {
    value: 1,
    label: '-dag 360',
  },
  {
    value: 2,
    label: '36 Månader',
  },
];

export const paymentPeriodSelect = [
  {
    value: 'Årsvis',
    label: 'Årsvis',
  },
  {
    value: 'Halvårsvis',
    label: 'Halvårsvis',
  },
  {
    value: 'Kvartalsvis',
    label: 'Kvartalsvis',
  },
  {
    value: 'Månadsvis',
    label: 'Månadsvis - Autogiro',
  },
];

export const timePerspectiveSelect = [
  {
    value: 'Krishink',
    label: 'Krishink',
  },
  {
    value: '12 Månader',
    label: '12 Månader',
  },
  {
    value: '5 år',
    label: '5 år',
  },
  {
    value: 'Sen',
    label: 'Sen',
  },
  {
    value: 'Oidentifierat',
    label: 'Oidentifierat',
  },
  {
    value: 'Barnspar',
    label: 'Barnspar',
  },
];

export const pensionCompensationPeriodSelect = [
  {
    value: 0,
    label: 'Livslång',
  },
  ...(() => {
    const newSelects = [];
    for (let i = 1; i <= 40; i++) {
      newSelects.push({ label: i.toString() + ' år', value: i });
    }
    return newSelects;
  })(),
];
