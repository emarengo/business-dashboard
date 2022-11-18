/* eslint-disable @typescript-eslint/no-shadow, no-useless-computed-key */
import React from 'react';

import Select from './Select';
import Styled from './styled';
import { IVehicle, IVehicleDataItem, FormErrors } from './vehicles/types';
import { FormState, IForm, IOption } from './types';
import { displayError } from '../functions';
import { apiService } from '../data';
import { ApiError, handleApiResponse } from '../data/api';

/** @todo Make 'IForm' to use a generic type */
const Form: React.FC<IForm<IVehicle>> = ({
  data,
  shouldSubmit,
  onAfterSubmit,
  onSubmit,
  onSubmitSuccess,
  onSubmitError,
  onChange
}) => {
  const state = (data || {}) as FormState<IVehicle>;
  const [formState, setFormState] = React.useState<FormState<IVehicle>>(state);
  const [errors, setErrors] = React.useState<FormErrors | null>(null);
  const [brandOptions, setBrandOptions] = React.useState<IOption[]>([]);
  const [modelOptions, setModelOptions] = React.useState<IOption[]>([]);
  const [colorOptions, setColorOptions] = React.useState<IOption[]>([]);
  const [parkingLotOptions, setParkingLotOptions] = React.useState<IOption[]>(
    []
  );
  const yearOptions = Array.from({ length: 21 }).map((_, i) => ({
    name: parseInt(`${new Date().getFullYear() - i}`, 10)
  }));
  const {
    ['id_brand']: brandId,
    ['id_city']: cityId,
    ['id_color']: colorId
  } = formState;

  const handleChange =
    (field: keyof IVehicle) =>
    // eslint-disable-next-line complexity
    (
      option: IOption,
      passive = false,
      onUpdateFormState?: (state: FormState<IVehicle>) => void
    ) => {
      const fs = { ...formState };
      let nextFormState: IVehicle = {
        ...fs,
        [field]: option.name
      };

      const _field = `id_${field}` as keyof IVehicle;

      if (option?.value) {
        nextFormState = { ...nextFormState, [_field]: option.value };
      }

      setFormState(nextFormState);

      if (onUpdateFormState) onUpdateFormState(nextFormState);

      // 'Not passive' means the value has changed by user
      if (onChange && !passive) {
        if (fs[field] !== option.name || fs[_field] !== option?.value) {
          onChange();
        }
      }
    };

  const handleInput =
    (field: string) => (event: React.FormEvent<HTMLInputElement>) => {
      setFormState({
        ...formState,
        [field]: event.currentTarget.value || null
      });

      if (onChange) onChange();
    };

  const getOptions = (data: IVehicleDataItem[]): IOption[] => {
    return data.reduce((accumulator: IOption[], item: IVehicleDataItem) => {
      return [
        ...accumulator,
        { name: item.name || item.title, value: item.id }
      ];
    }, []);
  };

  const validate = (): boolean => {
    /** @todo Use a component prop instead */
    const ignoreFields = ['contact_phone_number', 'id_vehicle', 'id_device'];

    const invalidFields = Object.entries(formState).filter(
      ([field, value]) => !ignoreFields.includes(field) && !value
    );

    // No errors
    if (invalidFields.length === 0) {
      // Clear previous errors
      setErrors(null);

      return true;
    }

    const _errors = new Map();

    // Store errors for empty fields
    invalidFields.forEach(([field]) =>
      _errors.set(field, {
        message: 'Please fill in this field',
        required: true
      })
    );

    // Show them
    setErrors(_errors);

    return false;
  };

  const error = (name: keyof IVehicle): React.ReactNode => {
    const _e = errors?.get(name);

    return (_e && !_e.required) || (_e?.required && !formState[name]) ? (
      <Styled.Error data-testid="error">{_e.message}</Styled.Error>
    ) : null;
  };

  const handleSubmitError = (serverError: ApiError): void => {
    const _errors = new Map(errors as FormErrors);
    switch (serverError.name) {
      case 'ERROR_DUPLICATE_KEY':
        if (new RegExp('id_device').test(serverError.message))
          _errors.set('id_device', {
            name: 'ServerError',
            message: 'This device code is already in use'
          });
        else
          _errors.set('plate_no', {
            name: 'ServerError',
            message: 'This number plate is already in use'
          });
        break;
      case 'INVALID_ID_DEVICE':
        _errors.set('id_device', {
          name: 'ServerError',
          message: 'This device code is invalid'
        });
        break;
      default:
        break;
    }

    if (_errors.size) {
      setErrors(_errors);
      //  Do not show the toast message
      return;
    }

    onSubmitError(serverError);
  };

  React.useEffect(() => {
    if (shouldSubmit) {
      if (validate())
        // eslint-disable-next-line func-names
        (async function () {
          handleApiResponse(
            await onSubmit(formState),
            () => onSubmitSuccess(data?.id_vehicle === undefined),
            handleSubmitError
          );
        })();

      if (onAfterSubmit) onAfterSubmit();
    }
    // eslint-disable-next-line
  }, [shouldSubmit]);

  React.useEffect(() => {
    (async () => {
      handleApiResponse(
        await apiService.getVehicleBrands(),
        (response) => {
          if ('vehicle_brands' in response) {
            const options = getOptions(response.vehicle_brands);

            setBrandOptions(options);
          }
        },
        (error) => {
          displayError(`${error.name}: ${error.message}`, true);
        }
      );

      // Vehicle color options
      handleApiResponse(
        await apiService.getVehicleColors(),
        (response) => {
          if ('vehicle_colors' in response) {
            const options = getOptions(response.vehicle_colors);

            setColorOptions(options);
          }
        },
        (error) => {
          displayError(`${error.name}: ${error.message}`, true);
        }
      );
    })();
  }, []);

  React.useEffect(() => {
    if (brandId)
      (async () => {
        handleApiResponse(
          await apiService.getVehicleModels(brandId),
          (response) => {
            if ('vehicle_models' in response) {
              const options = getOptions(response.vehicle_models);

              setModelOptions(options);
            }
          },
          (error) => {
            displayError(`${error.name}: ${error.message}`, true);
          }
        );
      })();
  }, [brandId]);

  React.useEffect(() => {
    if (cityId)
      (async () => {
        handleApiResponse(
          await apiService.getParkingLots(cityId),
          (response) => {
            if ('parking_lots' in response) {
              const options = getOptions(response.parking_lots);

              setParkingLotOptions(options);
            }
          },
          (error) => {
            displayError(`${error.name}: ${error.message}`, true);
          }
        );
      })();
  }, [cityId]);

  React.useEffect(() => {
    const _color = colorOptions.find((color) => color.value === colorId);

    if (_color)
      setFormState((fs) => ({
        ...fs,
        color: _color.name as string
      }));
  }, [colorOptions, colorId]);

  React.useEffect(() => {
    if (data) setFormState(data as FormState<IVehicle>);
  }, [data]);

  return (
    <Styled.Form data-testid="form">
      <Styled.Fieldset>
        <Styled.FieldsetLegend data-testid="legend">
          Basic Information
        </Styled.FieldsetLegend>
        <Styled.FieldsetRow columns={3}>
          <Styled.Label>
            Plates*
            <Styled.Input
              data-testid="input"
              placeholder="Enter plates"
              onChange={handleInput('plate_no')}
              value={formState.plate_no || ''}
            />
            {error('plate_no')}
          </Styled.Label>
          <Styled.Label>
            Brand*
            <Select
              options={brandOptions}
              defaultValue="Select a brand"
              value={formState.brand}
              onChange={(option, passive) => {
                handleChange('brand')(option, passive, (nextFormState) => {
                  // Reset 'model' when 'brand' is changed
                  setFormState({
                    ...nextFormState,
                    ['id_model']: undefined,
                    ['model']: ''
                  });
                });
              }}
              name="brand"
            />
            {error('brand')}
          </Styled.Label>
          <Styled.Label>
            Model*
            <Select
              options={modelOptions}
              defaultValue="Select a model"
              dependsOn={formState.id_brand}
              value={formState.model}
              onChange={handleChange('model')}
              name="model"
            />
            {error('model')}
          </Styled.Label>
          <Styled.Label>
            Color*
            <Select
              options={colorOptions}
              defaultValue="Select a color"
              value={formState.color}
              onChange={handleChange('color')}
              name="color"
            />
            {error('color')}
          </Styled.Label>
          <Styled.Label>
            Year*
            <Select
              options={yearOptions}
              defaultValue="Select a year"
              value={formState.model_year}
              onChange={handleChange('model_year')}
              name="year"
            />
            {error('model_year')}
          </Styled.Label>
        </Styled.FieldsetRow>
      </Styled.Fieldset>
      <Styled.Fieldset>
        <Styled.FieldsetLegend data-testid="legend">
          Registration Details
        </Styled.FieldsetLegend>
        <Styled.FieldsetRow columns={2}>
          <Styled.Label>
            VIN*
            <Styled.Input
              data-testid="input"
              placeholder="Enter VIN number"
              value={formState.vin || ''}
              onChange={handleInput('vin')}
            />
            {error('vin')}
          </Styled.Label>
          <Styled.Label>
            Contact Number
            <Styled.Tooltip>
              The number that the passenger will call during a ride.
            </Styled.Tooltip>
            <Styled.Input
              data-testid="input"
              placeholder="e.g. 00525536884600"
              value={formState.contact_phone_number || ''}
              onChange={handleInput('contact_phone_number')}
            />
          </Styled.Label>
          <Styled.Label>
            Parking Lot*
            <Select
              options={parkingLotOptions}
              defaultValue="Select a parking lot"
              value={formState.parking_lot}
              onChange={handleChange('parking_lot')}
              name="parking_lot"
            />
            {error('parking_lot')}
          </Styled.Label>
          <Styled.Label>
            Device Code
            <Styled.Tooltip>
              The UUID of the device that will be paired with this vehicle.
            </Styled.Tooltip>
            <Styled.Input
              data-testid="input"
              placeholder="Enter code"
              value={formState.id_device || ''}
              onChange={handleInput('id_device')}
              isInvalid={!!errors?.get('id_device')}
            />
            {error('id_device')}
          </Styled.Label>
        </Styled.FieldsetRow>
      </Styled.Fieldset>
    </Styled.Form>
  );
};

export default Form;
