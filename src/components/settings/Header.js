import React from 'react';
import { Icons } from '@thebeatapp/beat-ui';

import { useAppContext } from '../../provider';
import Settings from './styled';
import Actions from './actions';
import { getActiveCity, displayError } from '../../functions';
import { apiService } from '../../data';
import { handleApiResponse } from '../../data/api';
import { CitySettings } from '../../constants';

export default ({ state, dispatch, updatedAt }) => {
  const [{ cities: cityOptions }] = useAppContext();

  const getCitySettings = async (cityId) => {
    handleApiResponse(
      await apiService.getCityById(cityId),
      (response) => {
        dispatch({
          type: Actions.UPDATE_CITY_SETTINGS,
          payload: {
            isAlertingEnabled: false,
            isGoOfflineReasonsEnabled: Boolean(
              response[CitySettings.OfflineReasonEnabled]
            ),
            countryId: response[CitySettings.CountryId]
          }
        });
      },
      (error) => {
        displayError(`${error.name}: ${error.message}`);
      }
    );
  };

  React.useEffect(() => {
    // Active city is the default city (capital)
    /** @todo Need to rename to 'getDefaultCity' */
    const city = getActiveCity(cityOptions);

    if (city)
      dispatch({
        type: Actions.SELECT_CITY,
        payload: { defaultCity: city.label, cityId: city.value }
      });
    // eslint-disable-next-line
  }, [cityOptions]);

  React.useEffect(() => {
    if (state.cityId) getCitySettings(state.cityId);
    // eslint-disable-next-line
  }, [state.cityId]);

  const handleCityChange = async (event) => {
    dispatch({
      type: Actions.SELECT_CITY,
      payload: { cityId: event.target.value }
    });

    await getCitySettings(event.target.value);
  };

  return (
    <Settings.Header data-testid="settings-header">
      <Settings.HeaderLeft>
        <Settings.HeaderTitle>Settings</Settings.HeaderTitle>
        <Settings.Description>
          Settings for all Loonshot drivers in each city.
          <br />
          Select a city and apply your changes.
        </Settings.Description>
      </Settings.HeaderLeft>
      <Settings.HeaderRight>
        <Settings.Select
          id="settings-city-select"
          testId="settings-city-select"
          icon={Icons.marker}
          options={cityOptions}
          defaultSelected={state.defaultCity}
          size="small"
          onChange={handleCityChange}
        />
      </Settings.HeaderRight>
      {updatedAt && (
        <Settings.LastUpdate>last update: {updatedAt}</Settings.LastUpdate>
      )}
    </Settings.Header>
  );
};
