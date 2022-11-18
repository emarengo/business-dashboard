import React, { useEffect, useState } from 'react';
import {
  drawCreate,
  removeAllMarkers,
  unifyPolygons
} from '../../functions/geofence';
import * as turf from '@turf/turf';

import ImageMarker from './imageMarker';
import { addLayer } from './addLayer';
import { addSource } from './addSource';
import { ToolTip } from './ToolTip';
import { useAppContext } from '../../provider';

export const Draw = ({ map, draw }) => {
  const imageMarker = new ImageMarker(map);
  const body = document.body;

  const [polygonCreated, setPolygonCreated] = useState(false);
  const [initialState, setInitialState] = useState([]);
  const {
    id: { cityAreasLayerIdEdit }
  } = addLayer;
  const {
    type: { partnersAreasType, partnersAreasTypeTemp }
  } = addSource;

  const [{ mapContext }, dispatch] = useAppContext();

  const drawPolygon = event => {
    dispatch({
      type: 'SET_MAP',
      payload: { ...mapContext, resetCursorMode: false }
    });

    const currentData = [...map.getSource(partnersAreasType)._data.features];
    setInitialState(currentData);

    // Temp solution, keep initial state in another source to use it id needed
    const resetState = {
      type: 'FeatureCollection',
      features: currentData
    };
    map.getSource(partnersAreasTypeTemp).setData(resetState);

    const selectedArea = drawCreate(map, cityAreasLayerIdEdit, event);
    removeAllMarkers();
    const unifiedState = unifyPolygons(
      map,
      selectedArea,
      partnersAreasType,
      currentData
    );

    if (!unifiedState) {
      dispatch({
        type: 'SET_MAP',
        payload: { ...mapContext, resetCursorMode: true }
      });
    }

    if (unifiedState) {
      const latLng = turf.centroid(event.features[0]).geometry.coordinates;

      map.getSource(partnersAreasType).setData(unifiedState);
      map.getSource('drawnArea').setData({ ...unifiedState });
      // Place image marker on center of polygon
      imageMarker.addImage(latLng[0], latLng[1], 'add');
    }

    // On drawn polygon add a class for deltas functionality
    body.classList.add('polygonDrawn');

    // Delete drawn tool helper polygon
    draw.deleteAll();
    setPolygonCreated(true);
  };

  useEffect(() => {
    map.once('draw.create', event => {
      drawPolygon(event);
    });
    return () => {
      map.off('draw', drawPolygon);
    };
  }, []);

  useEffect(() => {
    if (polygonCreated) {
      map.on('click', 'imageLayer', () => {
        // Add this class so in deltas we count this polygon on click
        body.classList.add('addPolygon');
        imageMarker.removeImage();
      });

      map.once('sourcedata', () => {
        map.once('click', () => {
          if (map.getSource('imageSource')) {
            body.classList.add('removePolygon');
            const resetState = {
              type: 'FeatureCollection',
              features: initialState
            };
            map.getSource(partnersAreasType).setData(resetState);

            imageMarker.removeImage();
          }
        });
      });
    }
  }, [polygonCreated, map, initialState]);

  return <ToolTip />;
};
