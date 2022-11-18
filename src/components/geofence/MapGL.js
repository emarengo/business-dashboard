import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

import { useAppContext } from '../../provider';
import { mapLayers } from './mapLayers';
import { mapSources } from './mapSources';
import { viewTabEvents } from './mapEvents/initialEvents';
import { onMouseMove } from './mapEvents/editModeEvents';
import ImageMarker from './imageMarker';
import { addLayer } from './addLayer';

import defaultMapTheme from './Themes';
import { removeAllMarkers } from '../../functions/geofence';

import { Draw } from './Draw';

const { drawTool } = defaultMapTheme;
const MapGL = ({
  style,
  mapStyle,
  center,
  zoom,
  cityAreas,
  selectedCity,
  isViewMode,
  setNewMapData,
  viewModeCityAreas
}) => {
  const { cityAreasView } = defaultMapTheme;

  const [map, setMap] = useState(null);
  const [{ mapContext }, dispatch] = useAppContext();

  const { partnersAreas, customPoints, cursorMode = '' } = mapContext || {};

  const [draw, setDraw] = useState(null);
  const mapRef = useRef({});
  const popUpRef = useRef(
    new mapboxgl.Popup({ offset: 15, closeButton: false })
  );
  const {
    id: { customPointsId, cityAreasLayerIdEdit }
  } = addLayer;

  const MAPBOX_ACCESS_TOKEN =
    'pk.eyJ1IjoiYmVhdGFkbWlpbiIsImEiOiJja2JjMDRwY3UwMmhyMzBueWRjdTZ3N3QyIn0.REFbsl-3NGN-N1grzgwvjw';

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: mapStyle,
      center: center ? center : [-99.2256855091, 19.3855959917],
      zoom,
      attributionControl: false,
      accessToken: MAPBOX_ACCESS_TOKEN
    });

    const draw = new MapboxDraw({
      displayControlsDefault: false,
      styles: drawTool
    });

    map.addControl(draw);
    map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

    onMouseMove(map, popUpRef, draw);
    viewTabEvents(map, popUpRef);

    map.on('click', () => {
      if (map.getSource('partnersAreas')) {
        setTimeout(() => {
          setNewMapData(map.getSource('partnersAreas')._data);
        }, 200);
      }
    });

    setDraw(draw);
    setMap(map);

    return () => map.remove();
  }, []);

  const loadCityAreas = cityAreas => {
    if (map && map.getSource('cityAreasView')) {
      const cityAreasView = map.getSource('cityAreasView');

      cityAreasView.setData({
        type: 'FeatureCollection',
        features: cityAreas
      });
    }
  };

  useEffect(() => {
    if (!viewModeCityAreas) {
      loadCityAreas([]);
    }
    if (isViewMode && viewModeCityAreas && partnersAreas.geo !== null) {
      map.once('sourcedata', () => {
        loadCityAreas(viewModeCityAreas);
      });

      map.on('load', () => {
        loadCityAreas(viewModeCityAreas);
      });
    }
  }, [viewModeCityAreas, isViewMode]);

  useEffect(() => {
    if (map) {
      map.flyTo({
        center
      });
    }
  }, [center, map]);

  useEffect(() => {
    if (map) {
      const { geo, id = '' } = partnersAreas;
      dispatch({
        type: 'SET_MAP',
        payload: { map, partnersAreas, customPoints, selectedCity, draw, id }
      });
      mapSources(map, geo, cityAreas, customPoints, false);
      mapLayers(map, isViewMode, draw, false);

      // Update Sources if there are new data.
      const partnersSource = map.getSource('partnersAreas');
      if (partnersSource && geo) {
        partnersSource.setData(geo);
      }

      const customPointsSource = map.getSource('customPoints');
      if (customPointsSource && customPoints) {
        customPointsSource.setData({
          type: 'FeatureCollection',
          features: [...customPoints]
        });
      }

      // Initialize source
      if (partnersSource && geo === null) {
        partnersSource.setData({
          type: 'FeatureCollection',
          features: []
        });
      }

      if (isViewMode) {
        draw.deleteAll();
        removeAllMarkers();

        if (map.getSource('imageSource')) {
          // On view change remove image if exists
          const imageMarker = new ImageMarker(map);
          imageMarker.removeImage();
        }
        popUpRef.current.remove();
        map.getCanvas().style.cursor = 'default';
        draw.changeMode('simple_select');
      }
    }
  }, [map, partnersAreas, cityAreas, isViewMode, selectedCity]);

  useEffect(() => {
    // Change hierarchy of city area layer
    if (!isViewMode && map) {
      map.moveLayer(cityAreasLayerIdEdit, 'gl-draw-polygon-stroke-active.cold');
      map.moveLayer(customPointsId);
    }
  }, [isViewMode]);

  useEffect(() => {
    const _el = document.getElementById('toolTip');

    function addDrawListener(event) {
      _el.style.top = event.clientY + 'px';
      _el.style.left = event.clientX + 'px';
    }

    if (cursorMode === 'DRAW' && !isViewMode && _el) {
      document.addEventListener('mousemove', addDrawListener);
    }

    return () => document.removeEventListener('mousemove', addDrawListener);
  }, [cursorMode, isViewMode]);

  return (
    <>
      {cursorMode === 'DRAW' && <Draw map={map} draw={draw} />}
      <div style={style} ref={mapRef} />
    </>
  );
};

export default MapGL;
