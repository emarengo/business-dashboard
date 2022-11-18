import React, { useState, useEffect } from 'react';
import SvgIcons from '../../svgs';
import Styled from './styled';

import * as turf from '@turf/turf';
import { useAppContext } from '../../../provider';
import apiService from '../../../data/api';
import { addSource } from '../addSource';
import { removeAllPopups, removeAllMarkers } from '../../../functions/geofence';
import {
  addMarkerCreate,
  addManualEdit,
  removeMarkerCreate,
  removeManualEdit
} from '../mapEvents/editModeEvents';
import ConfirmationModal from '../../history/ConfirmationModal';
import Notification from '../../Notification';

const MODES = { CURSOR: 'CURSOR', DRAW: 'DRAW', MARKER: 'MARKER' };

const EditMapActions = ({
  editGeofenceSuccessMessage,
  openFilters,
  changeView
}) => {
  const [editModeType, setEditModeType] = useState(MODES.CURSOR);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [notification, setNotification] = useState({});
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMapStateUpdated, setIsMapStateUpdated] = useState(true);
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [sourceAdd, setSourceAdd] = useState([]);
  const [preventClickMap, setPreventClickMap] = useState(false);

  const [{ mapContext }, dispatch] = useAppContext();
  const {
    map,
    selectedCity,
    draw,
    resetCursorMode = false,
    partnersAreas: { id = '', geo = null } = {}
  } = mapContext || {};

  const {
    type: {
      partnersAreasType,
      customPointsType,
      partnersAreasTypeTemp,
      customPointsTypeTemp
    }
  } = addSource;

  const handleFilters = () => {
    setIsFiltersVisible(!isFiltersVisible);
    openFilters(!isFiltersVisible);
  };
  const handleUndo = () => map.getSource(partnersAreasType).setData(geo);

  useEffect(() => {
    if (isFiltersVisible && notification.type === 'failure') {
      setIsNotificationVisible(false);
    }
  }, [isFiltersVisible, notification]);

  useEffect(() => {
    map.on('mousemove', event => {
      // When draw mode create drawing tooltip
      if (map.getSource('imageSource')) {
        setIsMapStateUpdated(false);
      } else {
        setPreventClickMap(false);
        setIsMapStateUpdated(true);
      }
    });
  }, [map]);

  const uploadGeojson = async (
    newPartnersArea,
    selectedCity,
    geoJsonVersionId = ''
  ) => {
    let response = {};
    setIsLoading(true);

    if (geoJsonVersionId) {
      const { hasError = false, id = '' } = await apiService.updateGeojson(
        newPartnersArea,
        selectedCity,
        geoJsonVersionId,
        true
      );
      response.err = hasError;
      response.createdId = id;
    } else {
      const { hasError = false, id = '' } = await apiService.createGeojson(
        newPartnersArea,
        selectedCity
      );

      response.err = hasError;
      response.createdId = id;
    }
    return response;
  };

  const handleSave = async isMapStateUpdated => {
    const {
      _data: { features }
    } = map.getSource(partnersAreasType);
    const customPoints = map.getSource(customPointsType);

    // Temp solution, in case user doesn't click add on the drawn polygon and saves then reset state
    let newData = features;
    if (!isMapStateUpdated) {
      newData = map.getSource(partnersAreasTypeTemp)._data.features;
    }

    // Pass selectedCity to polygons since we only have access here to the city, find better solution in the future
    const featuresWithCity = [...newData].reduce((acc, feature) => {
      if (feature.geometry.type === 'Polygon') {
        acc.push({
          ...feature,
          properties: { ...feature.properties, ...{ city_id: selectedCity } }
        });
      }
      return acc;
    }, []);

    const allFeatures = [...featuresWithCity, ...customPoints._data.features];
    const options = { precision: 7 };

    const lowerPrecisionFeatures = [...allFeatures].map(feature => {
      if (feature) {
        return turf.truncate(feature, options);
      }
    });

    const copyCustomPoints = [...customPoints._data.features];
    const copyPartnerAreaFeatures = [...lowerPrecisionFeatures];

    const pointInPolygon = feature => {
      copyCustomPoints.map(point => {
        if (
          feature.geometry.type !== 'Point' &&
          turf.booleanPointInPolygon(point, feature)
        ) {
          point.properties.polygon_id = feature.properties.polygon_id;
        }
      });
    };

    const polygonFeatures =
      copyCustomPoints &&
      copyPartnerAreaFeatures.reduce((acc, feature) => {
        pointInPolygon(feature);
        if (feature.geometry.type !== 'Point') {
          acc.push(feature);
        }
        return acc;
      }, []);

    const updatedFeatures = [...polygonFeatures, ...copyCustomPoints];

    const newPartnersArea = {
      type: 'FeatureCollection',
      features: updatedFeatures
    };

    setEditModeType('CURSOR');

    let response;
    if (newPartnersArea.features.length === 0) {
      response = (await apiService.deleteGeofenceArea(selectedCity, id)) || {};
    } else {
      response = await uploadGeojson(newPartnersArea, selectedCity, id);
    }

    if (response.err) {
      setNotification({
        type: 'failure',
        title: 'Unable to save changes. This map instance has expired.',
        hasCloseButton: true
      });
      setIsModalVisible(false);
      setIsNotificationVisible(true);
      setIsFiltersVisible(false);
      openFilters(false);
    } else {
      let currentId = response.createdId ? response.createdId : id;

      if (newPartnersArea.features.length === 0) {
        currentId = '';
      }

      // @TODO remove this when city_ids property in BE is an array of integers
      newPartnersArea.features.forEach((feature, i) => {
        if (
          feature.properties.city_area_ids &&
          feature.geometry.type === 'Polygon'
        ) {
          const formated = feature.properties.city_area_ids.split(',');
          newPartnersArea.features[
            i
          ].properties.city_area_ids = formated.map(o => parseInt(o, 10));
        }
      });

      dispatch({
        type: 'SET_MAP',
        payload: { map, partnersAreas: { geo: newPartnersArea, id: currentId } }
      });
      editGeofenceSuccessMessage();
      changeView(true);
    }
  };

  useEffect(() => {
    if (resetCursorMode) {
      setEditModeType('CURSOR');
    }
  }, [resetCursorMode]);

  useEffect(() => {
    if (!isModalVisible) {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  }, [isModalVisible, isMapStateUpdated]);

  if (map.getSource('drawnArea')._data.features.length !== 0) {
    const resetState = {
      type: 'FeatureCollection',
      features: []
    };

    map.getSource('drawnArea').setData(resetState);
    setTimeout(() => {
      setSourceAdd(true);
    }, 200);
  }

  useEffect(() => {
    if (sourceAdd) {
      setEditModeType('CURSOR');
      setPreventClickMap(true);
    }
  }, [sourceAdd]);

  useEffect(() => {
    //remove all edit related events
    removeAllMarkers();
    removeAllPopups();
    removeMarkerCreate(map);
    removeManualEdit(map);

    setSourceAdd(false);

    if (editModeType === MODES.CURSOR) {
      const currentMarkers = map.getSource(customPointsTypeTemp);
      if (currentMarkers && currentMarkers._data.features.length) {
        map.getSource(customPointsType).setData({
          type: 'FeatureCollection',
          features: currentMarkers._data.features
        });
        map.getSource(customPointsTypeTemp).setData({
          type: 'FeatureCollection',
          features: []
        });
      }
      map.getCanvas().style.cursor = 'default';
      draw.changeMode('simple_select');
      !preventClickMap && addManualEdit(map);
    }
    if (editModeType === MODES.MARKER) {
      draw.changeMode('simple_select');
      map.getCanvas().style.cursor = 'pointer';
      addMarkerCreate(map);
    }
    if (editModeType === MODES.DRAW) {
      draw.changeMode('draw_polygon');
      map.getCanvas().style.cursor = 'crosshair';
    }
  }, [editModeType, map, preventClickMap]);

  useEffect(() => {
    dispatch({
      type: 'SET_MAP',
      payload: { ...mapContext, cursorMode: editModeType }
    });
  }, [editModeType]);

  return (
    <>
      <Styled.EditActions
        isFiltersVisible={isFiltersVisible}
        onMouseEnter={() => {
          if (editModeType === MODES.MARKER) {
            removeAllMarkers();
            removeMarkerCreate(map);
          }
        }}
        onMouseLeave={() =>
          editModeType === MODES.MARKER && addMarkerCreate(map)
        }
      >
        {/* <Styled.ActionButton testId="undoBtn" onClick={handleUndo}>
        <SvgIcons.Undo />
      </Styled.ActionButton> */}
        <Styled.ActionButton
          testId="saveBtn"
          onClick={() => setIsModalVisible(true)}
        >
          Save changes
        </Styled.ActionButton>
        <Styled.GroupedActions>
          <Styled.ActionButtonTransparent
            id="pointer-selection-item"
            testId="pointerBtn"
            className={editModeType === MODES.CURSOR && 'active'}
            onClick={() => {
              setEditModeType(MODES.CURSOR);
            }}
          >
            <SvgIcons.Pointer />
          </Styled.ActionButtonTransparent>
          <Styled.ActionButtonTransparent
            id="draw-selection-item"
            testId="drawBtn"
            className={editModeType === MODES.DRAW && 'active'}
            onClick={() => {
              setEditModeType(MODES.DRAW);
            }}
          >
            <SvgIcons.Draw />
          </Styled.ActionButtonTransparent>
          <Styled.ActionButtonTransparent
            id="pin-selection-item"
            testId="pinBtn"
            className={editModeType === MODES.MARKER && 'active'}
            onClick={() => {
              setEditModeType(MODES.MARKER);
            }}
          >
            <SvgIcons.Pin />
          </Styled.ActionButtonTransparent>
        </Styled.GroupedActions>
        <Styled.ActionButtonTransparent
          className={isFiltersVisible && 'active'}
          testId="filtersBtn"
          hasShadow
          onClick={handleFilters}
        >
          <SvgIcons.Filters />
        </Styled.ActionButtonTransparent>
        <ConfirmationModal
          isVisible={isModalVisible}
          overlayClass="versionModalBg"
          onClose={() => setIsModalVisible(false)}
          onConfirm={() => handleSave(isMapStateUpdated)}
          isLoading={isLoading}
          text={
            !isLoading
              ? 'This action will update geofenced areas for all partner drivers. Earlier versions will still be available in history.'
              : 'Please wait… We’re uploading your changes. '
          }
        />
      </Styled.EditActions>
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
    </>
  );
};

export default EditMapActions;
