import { IServiceOption, IDriversFilterOption } from 'components/types';
import { Languages } from 'components/drivers/types';
import i18n from 'i18n';
const lang = Languages.English;

export const serviceOptmx: IServiceOption[] = [
  {
    label: i18n[lang].allServices,
    value: '',
    key: '0'
  },
  {
    label: 'Tesla',
    value: '19',
    key: '1'
  },
  {
    label: 'Zero',
    value: '22',
    key: '2'
  }
];

export const serviceOptcl: IServiceOption[] = [
  {
    label: i18n[lang].allServices,
    value: '',
    key: '0'
  },
  {
    label: 'Zero',
    value: '14',
    key: '1'
  }
];

export const serviceOptco: IServiceOption[] = [
  {
    label: i18n[lang].allServices,
    value: '',
    key: '0'
  },
  {
    label: 'Zero',
    value: '38',
    key: '1'
  }
];

export const driversFilterOpt: IDriversFilterOption[] = [
  {
    label: i18n[lang].allDrivers,
    value: '',
    key: '0'
  },
  /* {
    label: i18n[lang].exceededBreak,
    value: 'exceeded-break-time',
    key: '1'
  }, */
 /*  {
    label: i18n[lang].offline,
    value: 'offline',
    key: '2'
  }, */
  {
    label: i18n[lang].buffer,
    value: 'buffered',
    key: '3'
  },
/*   {
    label: i18n[lang].lateShift,
    value: 'late-for-shift',
    key: '4'
  } */
];
