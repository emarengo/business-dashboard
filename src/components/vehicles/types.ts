import { ICityOption } from '../types';

export type IVehicle = {
  brand?: string;
  color?: string;
  contact_phone_number?: string;
  id_brand?: number;
  id_city?: number;
  id_color?: number;
  id_device?: number;
  id_model?: number | undefined;
  id_parking_lot?: number;
  id_vehicle?: number;
  model?: string;
  model_year?: number;
  parking_lot?: string;
  plate_no?: string;
  vin?: string;
};

export type IVehicleDataItem = {
  // eslint-disable-next-line no-unused-vars
  [K in 'name' | 'title']: string;
} & { id: number };

export type FormErrors = Map<keyof IVehicle, Error & { required?: boolean }>;

export interface IVehicleForm {
  id: string;
  city: ICityOption;
  shouldSubmit: boolean;
  onAfterSubmit: () => void;
  onSubmitSuccess: (registered: boolean) => void;
  onSubmitError: () => void;
  onChange: () => void;
}
