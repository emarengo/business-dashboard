import React from 'react';

import Form from '../Form';
import { apiService } from '../../data';
import { displayError, mapToVehicle } from '../../functions';
import { handleApiResponse } from '../../data/api';
import { IVehicle, IVehicleForm } from './types';

const VehicleForm: React.FC<IVehicleForm> = ({
  id,
  city,
  shouldSubmit,
  onAfterSubmit,
  onSubmitSuccess,
  onSubmitError,
  onChange
}) => {
  const initVehicle = mapToVehicle({ id_city: +city.value as number });
  const [vehicle, setVehicle] = React.useState<IVehicle>(initVehicle);

  React.useEffect(() => {
    if (id)
      (async () => {
        handleApiResponse(
          await apiService.getVehicle(id),
          (response) => {
            if ('vehicle' in response) {
              setVehicle(mapToVehicle(response.vehicle));
            }
          },
          (error) => {
            displayError(`${error.name} ${error.message}`, true);
          }
        );
      })();
  }, [id]);

  return (
    <Form
      data={vehicle}
      shouldSubmit={shouldSubmit}
      onSubmit={
        Number.isNaN(parseInt(id))
          ? apiService.createVehicle
          : apiService.updateVehicle
      }
      onAfterSubmit={onAfterSubmit}
      onSubmitError={onSubmitError}
      onSubmitSuccess={onSubmitSuccess}
      onChange={onChange}
    />
  );
};

export default VehicleForm;
