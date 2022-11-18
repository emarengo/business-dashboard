import jsonpack from 'jsonpack/main';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';

import { useAppContext } from '../provider';
import {
  mapCityOptions,
  displayError,
  getActiveCity,
  getDefaultCity
} from '../functions';
import { apiService } from '../data';
import { getWithExpiry, setWithExpiry } from '../functions/geofence';
import { handleApiResponse } from '../data/api';

export const useCityOptions = () => {
  const [, dispatch] = useAppContext();

  useEffect(() => {
    (async function () {
      handleApiResponse(
        await apiService.getCities(),
        (list = []) => {
          dispatch({
            type: 'SET_CITIES',
            payload: mapCityOptions(list)
          });
        },
        (error) => displayError(`${error.name}: ${error.message}`, true)
      );
    })();
    // eslint-disable-next-line
  }, []);

  return null;
};

export const GetAllAreasSources = () => {
  const cityId = useParams().city;
  const [partnersAreas, setPartnersAreas] = useState({});
  const [customPoints, setCustomPoints] = useState({});
  const [cityAreas, setCityAreas] = useState('');
  const [cityFilters, setCityFilters] = useState([]);

  const [, dispatch] = useAppContext();

  const findItem = (id, array) => {
    let item;
    for (let i = 0; i < array.length; i++) {
      if (array[i].city_area_id === id) {
        item = array[i].data;
        break;
      }
    }
    return item;
  };

  useEffect(() => {
    (async function () {
      let cityAreas;

      // Get city areas from local storage
      const cityAreaStorage = getWithExpiry('cityAreas');

      if (cityAreaStorage) {
        // Decompress and set the data from localStorage if are stored already
        cityAreas = jsonpack.unpack(cityAreaStorage);
      } else {
        cityAreas = await apiService.cityAreas();

        if (!cityAreas.hasError) {
          // Expires in 12 hours, which is translated in Milliseconds
          const expireTime = 43200000;

          // Save compressed city areas in local storage
          setWithExpiry('cityAreas', jsonpack.pack(cityAreas), expireTime);
        }
      }

      const cityAreasFilters = await apiService.cityAreasFilters();
      setCityFilters(cityAreasFilters);
      const cityAreasDetails = await apiService.cityAreasDetails();

      const newCityAreas =
        cityAreas.features &&
        cityAreas.features.reduce((acc, cityArea) => {
          const newProperties = findItem(cityArea.id, cityAreasDetails);
          if (newProperties) {
            acc.push({
              ...cityArea,
              properties: { ...cityArea.properties, ...newProperties }
            });
            return acc;
          }

          acc.push(cityArea);
          return acc;
        }, []);

      const newGeojson = {
        features: newCityAreas,
        type: 'FeatureCollection'
      };

      setCityAreas(newGeojson);
    })();
  }, []);

  useEffect(() => {
    (async function () {
      const response = await apiService.getPartnerAreas(cityId);
      // @TODO remove this when city_ids property in BE is an array of integers
      if (response.geo) {
        response.geo.features.forEach((feature, i) => {
          if (
            feature.properties.city_area_ids &&
            feature.geometry.type === 'Polygon'
          ) {
            const formated = feature.properties.city_area_ids.split(',');
            response.geo.features[i].properties.city_area_ids = formated.map(
              (o) => parseInt(o, 10)
            );
          }
        });

        const customPoints = response.geo.features.filter(
          (feature) => feature.geometry.type === 'Point'
        );
        setCustomPoints(customPoints);

        response.geo.features = response.geo.features.filter(
          (feature) => feature.geometry.type === 'Polygon'
        );
      } else {
        setCustomPoints([]);
      }
      // @TODO fix naming here. this should be partnerAreas. requires change in MapGl
      setPartnersAreas(response);
    })();
  }, [cityId]);

  useEffect(() => {
    dispatch({
      type: 'SET_MAP',
      payload: { partnersAreas, customPoints }
    });
  }, [partnersAreas, customPoints]);

  return [partnersAreas, cityAreas, customPoints, cityFilters];
};

export function usePolling(callee, period = 1, stop = false) {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const timeout = useRef(-1);

  const startTimer = (secs = 0) =>
    window.setTimeout(() => {
      (async function () {
        handleApiResponse(
          await callee.call(),
          (response) => setData(response.data || response),
          (error) => setError(`${error.name}: ${error.message}`)
        );
      })();
    }, secs * 1000);

  useEffect(() => {
    startTimer();
  }, []);

  useEffect(() => {
    if (stop || timeout.current) {
      window.clearTimeout(timeout.current);
    }

    if (stop) return;

    timeout.current = startTimer(period);
  }, [data, error, period, stop]);

  return [data, error];
}

export const useActiveCity = (cityOptions) => {
  const initCity = {
    label: '',
    value: ''
  };
  const [city, setCity] = useState(initCity);

  useEffect(() => {
    // Active city is the default city (capital)
    const activeCity = getActiveCity(cityOptions);
    if (activeCity) {
      setCity({ value: activeCity.value, label: activeCity.label });
    } else {
      const defaultCity = getDefaultCity(cityOptions);
      setCity({ value: defaultCity.value, label: defaultCity.label });
    }

    // eslint-disable-next-line
  }, [cityOptions]);

  return [city, setCity];
};
