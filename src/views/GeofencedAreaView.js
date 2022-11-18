import React, { useEffect, useState } from 'react';
import * as turf from '@turf/turf';
import { useParams } from 'react-router-dom';

import MapGL from '../components/geofence/MapGL';
import '../components/geofence/map.css';
import Styled from '../components/geofence/styled';
import { Header } from '../components/geofence/header/Header';
import Notification from '../components/Notification';
import InitialLoaderView from '../components/history/InitialLoaderView';

import { GetAllAreasSources } from '../hooks';
import { useAppContext } from '../provider';

import SvgIcons from '../components/svgs';
import { removeAllPopups } from '../functions/geofence';
import { Filters } from '../components/geofence/filters/Filters';

const mapStyle = 'mapbox://styles/beatadmiin/ckbjdllyd2cks1iqhmrdyk2km';

const GeofencedAreaView = ({ history }) => {
  const initialGeofenceInfo = {
    activeColonias: 0,
    polygons: 0,
    population: 0,
    eyeBalls: 0,
    eta: 0,
    etrc: 0,
    pickupTime: 0
  };

  const [{ mapContext = {} }] = useAppContext() || {};
  const {
    partnersAreas = {},
    map,
    draw,
    drawPolygonStatus = ''
  } = mapContext || {};
  const currentCity = useParams().city;

  const [selectedCity, setSelectedCity] = useState(currentCity);
  const [isViewMode, setIsViewMode] = useState(true);
  const [newMapData, setNewMapData] = useState(null);
  const [notification, setNotification] = useState({});
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);
  const [partnersSourcesAreas, citiesSourcesAreas, customPoints, cityFilters] =
    GetAllAreasSources(selectedCity);
  const [geofenceSumInfo, setGeofenceSumInfo] = useState(initialGeofenceInfo);
  const [mapHasError, setMapHasError] = useState(false);
  const [center, setCenter] = useState([]);
  const [openFilters, setOpenFilters] = useState(false);
  const [sourceExists, setSourceExists] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isEmptyArea, setIsEmptyArea] = useState(false);

  const showSuccessMessage = history.location.state?.showSuccessNotification;
  const shouldRenderMap = partnersSourcesAreas && citiesSourcesAreas;
  const cityId = useParams().city;

  useEffect(() => {
    if (partnersSourcesAreas.geo !== null) {
      const center =
        partnersSourcesAreas.geo &&
        turf.centroid(partnersSourcesAreas.geo.features[0])?.geometry
          .coordinates;
      setCenter(center);
    }
    setIsEmptyArea(partnersSourcesAreas.geo === null);
  }, [partnersSourcesAreas]);

  // Sum each of the geofence area information.
  const getSum = (item, sum) => {
    if (item && !isNaN(item)) {
      // eslint-disable-next-line no-param-reassign
      sum += item;
    }
    return sum;
  };

  const getSumTimestamp = (item, sum) => {
    if (!item) {
      // eslint-disable-next-line no-param-reassign
      sum += 0;
    }
    if (item) {
      const minutes = Math.floor(item / 60);
      // eslint-disable-next-line no-param-reassign
      sum += minutes;
    }
    return sum;
  };

  const isFloatOrNaN = (number) => {
    let newNumber = number;
    if (Number.isNaN(number)) {
      newNumber = 0;
    }
    if (Number(number) === number && number % 1 !== 0) {
      newNumber = number.toFixed(1);
    }
    return newNumber;
  };

  const editGeofenceSuccessMessage = () => {
    setNotification({
      type: 'success',
      title: 'Geofenced area was successfully updated'
    });
    setIsNotificationVisible(true);

    setTimeout(() => {
      setIsNotificationVisible(false);
    }, 3000);
  };

  useEffect(() => {
    if (showSuccessMessage) {
      setNotification({
        type: 'success',
        title: 'Geofenced area was successfully updated'
      });
      setIsNotificationVisible(true);
      // Clear the history state.
      history.replace(`/geofence/${selectedCity}`, null);

      setTimeout(() => {
        setIsNotificationVisible(false);
      }, 3000);
    }
  }, [history]);

  useEffect(() => {
    if (map) {
      // When loader is ready this will be removed
      map.once('load', () => {
        if (map.getSource('partnersAreas')) {
          setSourceExists(true);
          setInitialLoading(false);
        }
      });

      // When on view mode, basically reset state to the user's saved map.
      if (isViewMode) {
        setOpenFilters(false);
        setNewMapData(partnersAreas.geo);
        setIsEmptyArea(
          partnersAreas.geo?.features.length === 0 || partnersAreas.geo === null
        );
      }
    }
  }, [isViewMode, map]);

  useEffect(() => {
    // Display error if exists
    setMapHasError(
      partnersSourcesAreas.hasError || citiesSourcesAreas.hasError
    );

    if (
      (partnersAreas.geo && citiesSourcesAreas.features && !isViewMode) ||
      (newMapData && citiesSourcesAreas.features)
    ) {
      let populationSum = 0;
      let eyeBalls = 0;
      let etaSum = 0;
      let etrc = 0;
      let pickupTime = 0;
      let cityEyeballs = 0;
      let pickUpRate = 0;
      let requestIdleTime = 0;
      const currentColonias = [];

      // Pass the sum value to the specific geofence info var.
      const geofenceInfoSum = (id, array) => {
        for (let i = 0; i < array.length; i += 1) {
          if (array[i].id === id) {
            currentColonias.push(array[i]);
            populationSum = getSum(
              array[i].properties.population,
              populationSum
            );
            eyeBalls = getSum(array[i].properties.eyeballs, eyeBalls);

            etrc = getSum(array[i].properties.etrc, etrc);
            cityEyeballs = getSum(
              array[i].properties.eyeballs_as_pct_of_city,
              cityEyeballs
            );
            pickUpRate = getSum(array[i].properties.pickup_rate, pickUpRate);

            requestIdleTime = getSum(
              array[i].properties.requests_per_idle_time,
              requestIdleTime
            );

            pickupTime = getSumTimestamp(
              array[i].properties.pickup_time,
              pickupTime
            );

            etaSum = getSumTimestamp(array[i].properties.eta, etaSum);
            break;
          }
        }
      };

      // On initial map load gather map data from partnersAreas, else pass the new.
      const MapData = newMapData || partnersAreas.geo;
      const currentMapFeatures = [...MapData.features].reduce((acc, row) => {
        if (row.geometry.type !== 'Point') {
          acc.push(row);
        }
        return acc;
      }, []);
      const currentMapData = {
        features: currentMapFeatures
      };

      // Gather all the active city areas id's.
      const activeAreasSum = currentMapData.features.reduce((acc, feature) => {
        acc.push(feature.properties.city_area_ids);
        return acc;
      }, []);

      // Flatten the multi array in one to map it later on.
      // eslint-disable-next-line prefer-spread
      const flattenActiveColonias = [].concat.apply([], activeAreasSum);
      flattenActiveColonias.forEach((colonia) => {
        geofenceInfoSum(colonia, citiesSourcesAreas.features);
      });

      const createTimeStamp = (number) => {
        if (Number.isNaN(number)) {
          return 0;
        }
        const mins_num = parseFloat(number);
        const hours = Math.floor(mins_num / 60);
        const minutes = Math.floor(mins_num - (hours * 3600) / 60);
        let seconds = Math.floor(mins_num * 60 - hours * 3600 - minutes * 60);

        if (seconds < 10) {
          seconds = `0${seconds}`;
        }

        return `${minutes}:${seconds}`;
      };
      // Update the geofence info state.
      setGeofenceSumInfo({
        currentColonias,
        statsPolygons: currentMapData.features.length,
        statsActiveColonias: flattenActiveColonias.length,
        statsPopulation: populationSum,
        statsEyeBalls: eyeBalls,
        statsEtrc: isFloatOrNaN(etrc / flattenActiveColonias.length),
        statsEta: createTimeStamp(etaSum / flattenActiveColonias.length),
        statsPickupTime: createTimeStamp(
          pickupTime / flattenActiveColonias.length
        ),
        statsPickupTimeInMinutes: pickupTime,
        statsEtaInMinutes: etaSum,
        statsCityEyeballs: cityEyeballs.toFixed(1),
        statsRequestIdleTime: requestIdleTime.toFixed(1),
        statsPickUpRate:
          flattenActiveColonias.length &&
          (pickUpRate / flattenActiveColonias.length).toFixed(1)
      });
    } else {
      // If no geofence info data exists, use the default values.
      setGeofenceSumInfo(initialGeofenceInfo);
    }
  }, [partnersAreas, newMapData, citiesSourcesAreas, isViewMode]);

  useEffect(() => {
    if (mapHasError) {
      setNotification({
        type: 'failure',
        title: 'Something went wrong.',
        hasCloseButton: true
      });
      setIsNotificationVisible(true);
    }
  }, [mapHasError]);

  return (
    <>
      <Styled.MapGradient />
      <Header
        drawPolygonStatus={drawPolygonStatus}
        isEmptyArea={isEmptyArea}
        openFilters={(flag) => {
          setOpenFilters(flag);
        }}
        map={map}
        draw={draw}
        shouldRender={
          (shouldRenderMap && !mapHasError && sourceExists) ||
          (!initialLoading && partnersAreas.geo === null)
        }
        editGeofenceSuccessMessage={editGeofenceSuccessMessage}
        history={history}
        geofenceSumInfo={geofenceSumInfo}
        isViewMode={isViewMode}
        onCityChange={(cityId) => {
          setSelectedCity(cityId);
          history.push(`/geofence/${cityId}`);
        }}
        onViewChange={(e) => {
          removeAllPopups();
          setIsViewMode(e);
        }}
      />

      <Notification
        {...notification}
        className={
          notification.type === 'failure'
            ? 'notification error'
            : 'notification'
        }
        isVisible={isNotificationVisible}
        onClick={() => setIsNotificationVisible(false)}
      >
        {notification.message}
      </Notification>
      {initialLoading && !mapHasError && (
        <InitialLoaderView text="Please wait while loading geofenced area..." />
      )}
      {shouldRenderMap && !mapHasError && isViewMode && (
        <Styled.HistoryViewButtonWrapper>
          <Styled.HistoryViewButton
            data-testid="historyBtn"
            onClick={() => history.push(`/history/${cityId}`)}
          >
            <SvgIcons.HistoryRevert />
            Version history
          </Styled.HistoryViewButton>
        </Styled.HistoryViewButtonWrapper>
      )}
      {!mapHasError && shouldRenderMap && (
        <MapGL
          style={{ width: '100%', height: '100%' }}
          mapStyle={mapStyle}
          center={center}
          zoom={12}
          customPoints={customPoints}
          cityAreas={citiesSourcesAreas}
          selectedCity={selectedCity}
          isViewMode={isViewMode}
          setNewMapData={setNewMapData}
          viewModeCityAreas={geofenceSumInfo.currentColonias}
        />
      )}
      {openFilters && citiesSourcesAreas && (
        <Filters
          openFilters={openFilters}
          cityFilters={cityFilters}
          citiesSourcesAreas={citiesSourcesAreas}
          currentCity={currentCity}
          history={history}
        />
      )}
    </>
  );
};
export default GeofencedAreaView;
