import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';

import * as turf from '@turf/turf';
import mapboxgl from 'mapbox-gl';
import '../components/history/styles.css';
import Styled from '../components/history/styled';

import ConfirmationalModal from '../components/history/ConfirmationModal';
import Notification from '../components/Notification';

import apiService, { ApiError } from '../data/api';

import { transformHistoryPayload } from '../components/history/utils';
import { Header } from '../components/history/header/Header';
import Timeline from '../components/history/Timeline';
import NoVersionsView from '../components/history/NoVersionsView';
import InitialLoaderView from '../components/history/InitialLoaderView';
import UpdateLoaderView from '../components/history/UpdateLoaderView';

import { mapLayers } from '../components/geofence/mapLayers';
import { mapSources } from '../components/geofence/mapSources';
import { addSource } from '../components/geofence/addSource';

const mapStyle = 'mapbox://styles/beatadmiin/ckbjdllyd2cks1iqhmrdyk2km';

const VersionHistoryView = ({ history }) => {
  const [timelineData, setTimelineData] = useState(null);
  const [timelineView, setTimelineView] = useState('week');
  const [modalIsVisible, setModalIsVisible] = useState(false);
  const [isRevertDisabled, setIsRevertDisabled] = useState(true);
  const [versionInfo, setVersionInfo] = useState({});
  const [geoJson, setGeoJson] = useState(null);
  const [activeId, setActiveId] = useState(null);
  const [map, setMap] = useState(null);
  const [selectedCity, setSelectedCity] = useState(useParams().city);
  const [notification, setNotification] = useState({});
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);
  const [hasVersions, setHasVersions] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isReverting, setIsReverting] = useState(false);
  const {
    type: { partnersAreasType }
  } = addSource;

  const mapRef = useRef({});
  const MAPBOX_ACCESS_TOKEN =
    'pk.eyJ1IjoiYmVhdGFkbWlpbiIsImEiOiJja2JjMDRwY3UwMmhyMzBueWRjdTZ3N3QyIn0.REFbsl-3NGN-N1grzgwvjw';
  let mapInstance;

  const getPartnersAndVersions = async () => {
    setInitialLoading(true);
    if (selectedCity) {
      const { geo, id } = await apiService.getPartnerAreas(selectedCity);

      if (id) {
        const response = await apiService.historyVersions(id);

        if (response instanceof ApiError) {
          setInitialLoading(false);
          setModalIsVisible(false);
          setIsUpdating(true);
          return;
        }

        const transformedPayload = transformHistoryPayload(response);
        setActiveId(id);
        setTimelineData(transformedPayload);
        setHasVersions(true);
        setIsLoading(false);
        setIsUpdating(false);
      } else {
        setTimelineData(null);
        setHasVersions(false);
        setInitialLoading(false);
      }

      if (geo) {
        const center = turf.centroid(geo.features[0])?.geometry.coordinates;
        mapInstance = new mapboxgl.Map({
          container: mapRef.current,
          style: mapStyle,
          center,
          zoom: 10,
          attributionControl: false,
          accessToken: MAPBOX_ACCESS_TOKEN
        });
        setMap(mapInstance);
        mapSources(mapInstance, geo, [], [], true);
        mapLayers(mapInstance, true, {}, true);

        mapInstance.on('load', () => {
          setInitialLoading(false);
        });
      }
    }
  };

  useEffect(() => {
    getPartnersAndVersions();

    return () => {
      if (mapInstance) {
        mapInstance.remove();
      }
    };
  }, [selectedCity]);

  const onHistoryChange = async ({ id, isActive, date }) => {
    setIsLoading(true);
    if (id) {
      setVersionInfo({ id, isActive, date });
      setIsRevertDisabled(isActive);
      const { geo } = await apiService.getVersionPartnersArea(id);

      if (geo.features && map && hasVersions) {
        setGeoJson(geo);
      }
    }
  };

  useEffect(() => {
    if (map && geoJson) {
      const center = turf.centroid(geoJson.features[0])?.geometry.coordinates;

      const partnersSource = map.getSource(partnersAreasType);
      if (partnersSource) {
        partnersSource.setData(geoJson);

        const points = map.getSource('customPoints');
        const newCustomPoints = [...geoJson.features].reduce((acc, feature) => {
          if (feature.geometry.type === 'Point') {
            acc.push(feature);
          }
          return acc;
        }, []);

        points.setData({
          type: 'FeatureCollection',
          features: newCustomPoints
        });

        map.flyTo({
          center
        });
      }
      setIsLoading(false);
    }
  }, [geoJson, map]);

  const handleConfirmRevert = async () => {
    setIsReverting(true);
    const response = await apiService.updateGeojson(
      geoJson,
      selectedCity,
      activeId,
      false
    );

    // @TODO: ERROR & SUCCESS HANDLING
    if (response instanceof ApiError) {
      setNotification({
        type: 'failure',
        title: 'Changes were not saved due to an error.',
        hasCloseButton: true
      });
      setIsNotificationVisible(true);
      setModalIsVisible(false);
      setIsReverting(false);
    } else {
      history.push({
        pathname: `/geofence/${selectedCity}`,
        state: { showSuccessNotification: true }
      });
    }
  };

  return (
    <>
      {hasVersions && !isUpdating && <Styled.MapGradient />}
      <Header
        onTimelineChange={(value) => setTimelineView(value)}
        onCityChange={(value) => setSelectedCity(value)}
        history={history}
      />
      <Notification
        {...notification}
        className="notification error"
        isVisible={isNotificationVisible}
        onClick={() => setIsNotificationVisible(false)}
      >
        {notification.message}
      </Notification>
      <Timeline
        onHistoryChange={onHistoryChange}
        showBy={timelineView}
        data={timelineData}
      />
      {!hasVersions && <NoVersionsView />}
      {isUpdating && <UpdateLoaderView />}
      {initialLoading && (
        <InitialLoaderView text="Please wait while loading all versions…" />
      )}
      {hasVersions && (
        <>
          <Styled.HistoryMapContainer isLoading={isLoading}>
            <Styled.HistoryMap ref={mapRef} />
          </Styled.HistoryMapContainer>
          <Styled.InfoBar data-testid="infoBar">
            <Styled.Title data-testid="idInfoTitle">ID: </Styled.Title>
            <Styled.Info data-testid="idInfoValue">
              {versionInfo.id}
            </Styled.Info>
            {versionInfo.isActive && (
              <>
                <Styled.Title data-testid="activeInfoTitle">
                  Active since:
                </Styled.Title>
                <Styled.Info data-testid="activeInfoValue">
                  {versionInfo.date}
                </Styled.Info>
              </>
            )}
          </Styled.InfoBar>
          <Styled.RevertButton
            testId="revertBtn"
            disabled={isRevertDisabled}
            onClick={() => setModalIsVisible(true)}
          >
            Revert
          </Styled.RevertButton>
        </>
      )}
      <ConfirmationalModal
        isVisible={modalIsVisible}
        overlayClass="versionModalBg"
        onConfirm={handleConfirmRevert}
        onClose={() => setModalIsVisible(false)}
        isLoading={isReverting}
        text={
          !isReverting
            ? 'This action will replace the shift area of partner drivers with the one in the version selected.'
            : 'Please wait… We’re uploading your changes. '
        }
      />
    </>
  );
};

export default VersionHistoryView;
