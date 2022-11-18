import React from 'react';
import ReactDOM from 'react-dom';
import * as turf from '@turf/turf';
import mapboxgl from 'mapbox-gl';

import CustomPointPopup from '../components/CustomPointPopup';
import CustomPointTooltip from '../components/CustomPointTooltip';
import CityArea from '../cityArea';
import { addLayer } from '../addLayer';
import { addSource } from '../addSource';
import { partnersAreasLeave } from '../partnersAreas';
import CityAreaInfoPane from '../cityAreaInfoPane/CityAreaInfoPane';

import {
  createPopup,
  isDrawing,
  removeAllMarkers,
  getIntersectingPartnerAreas,
  isInsidePartnerArea,
  addMarkerClickHandler,
  removeMarkerClickHandler,
  uuid
} from '../../../functions/geofence';

export const onMouseMove = (map, popUpRef, draw) => {
  const {
    id: { cityAreasLayerIdEdit },
    events: { mouse_move, mouse_leave }
  } = addLayer;

  if (map) {
    const cityArea = new CityArea(map);

    map.on(mouse_move, cityAreasLayerIdEdit, event => {
      const pinSelection = document.getElementById('pin-selection-item');
      if (
        pinSelection &&
        document
          .getElementById('pin-selection-item')
          .className.includes('active')
      ) {
        return;
      }
      if (!isDrawing(draw)) {
        const {
          features: [polygon]
        } = event;
        cityArea.onMouseOver(polygon.id, 'cityAreas', map =>
          createPopup(map, CityAreaInfoPane, polygon, event, popUpRef)
        );
      }
    });

    map.on(mouse_leave, cityAreasLayerIdEdit, () => {
      partnersAreasLeave(map, cityArea.getId(), 'cityAreas');
      popUpRef.current.remove();
    });
  }
};

//@TODO move this to a seperate file
///////////////////////////////////
////////   Custom Points   ////////
///////////////////////////////////

export const onClickMarker = function(e) {
  if (e.originalEvent.cancelBubble) {
    return;
  }
  e.originalEvent.cancelBubble = true;
  if (e.features.length) {
    let feature = e.features[0];

    feature.properties = {
      ...feature.properties,
      lng: e.lngLat.lng,
      lat: e.lngLat.lat
    };

    // create popup node
    const popUpInstance = new mapboxgl.Popup({
      offset: 18,
      closeButton: false,
      className: 'custom-point-actions-popup'
    });
    const popupNode = document.createElement('div');
    ReactDOM.render(
      <CustomPointPopup
        dataTestId="custom-point-actions-popup"
        map={this}
        feature={feature}
      />,
      popupNode
    );
    // set popup on map
    popUpInstance
      .setLngLat([e.lngLat.lng, e.lngLat.lat])
      .setDOMContent(popupNode)
      .addTo(this);
  }
};

export const onClickMarkerPlace = function(e) {
  const {
    customPointsType,
    cityAreasType,
    customPointsTypeTemp
  } = addSource.type;
  if (e.originalEvent.cancelBubble) {
    //Revert changes in case we change mode type without completing the move custom point action
    const initialMarkers = this.getSource(customPointsType);
    this.getSource(customPointsTypeTemp).setData({
      type: 'FeatureCollection',
      features: [...initialMarkers._data.features]
    });
    return;
  }
  e.originalEvent.cancelBubble = true;
  const infoPopup = document.getElementsByClassName(
    'custom-point-actions-popup'
  );
  if (!infoPopup.length) {
    const userPolygon = e.features[0];

    //Reset temp state
    this.getSource(customPointsTypeTemp).setData({
      type: 'FeatureCollection',
      features: []
    });

    // find cityArea the marker is contained in
    const parentCityArea = isInsidePartnerArea(
      e.lngLat.lng,
      e.lngLat.lat,
      this.getSource(cityAreasType)._data.features
    );

    const newMarker = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [e.lngLat.lng, e.lngLat.lat]
      },
      properties: {
        id: uuid(),
        city_area_id: parentCityArea.id,
        polygon_id: userPolygon.properties.polygon_id
      }
    };
    const currentMarkers = this.getSource(customPointsType);
    this.getSource(customPointsType).setData({
      type: 'FeatureCollection',
      features: [{ ...newMarker }, ...currentMarkers._data.features]
    });
  }
};

export const customPinsToolTipPlace = function(e) {
  const polygonHover = this.queryRenderedFeatures(e.point, {
    layers: ['partners-areas-addLayer']
  });
  const cityAreaHover = this.queryRenderedFeatures(e.point, {
    layers: ['cityAreas-addLayer-edit']
  });
  let infoMessage = '';
  if (polygonHover.length && cityAreaHover.length) {
    this.getCanvas().style.cursor = 'pointer';
    infoMessage = 'Click to place';
  } else {
    this.getCanvas().style.cursor = 'no-drop';
    infoMessage = 'Pin can only be placed in polygons';
  }

  removeAllMarkers();
  const popUpInstance = new mapboxgl.Popup({
    offset: 18,
    closeButton: false,
    className: 'custom-pin-drop-message'
  });
  const popupNode = document.createElement('div');

  ReactDOM.render(
    <CustomPointTooltip
      dataTestId="custom-pin-info-message"
      text={infoMessage}
    />,
    popupNode
  );
  popUpInstance
    .setLngLat([e.lngLat.lng, e.lngLat.lat])
    .setDOMContent(popupNode)
    .addTo(this);
};

export const customPinsToolTip = function(e) {
  const polygonHover = this.queryRenderedFeatures(e.point, {
    layers: ['partners-areas-addLayer']
  });
  const cityAreaHover = this.queryRenderedFeatures(e.point, {
    layers: ['cityAreas-addLayer-edit']
  });
  const customPinHover = this.queryRenderedFeatures(e.point, {
    layers: ['custom-points-layer']
  });

  removeAllMarkers();
  const infoPopup = document.getElementsByClassName(
    'custom-point-actions-popup'
  );
  if (customPinHover.length) {
    this.getCanvas().style.cursor = 'pointer';
  } else if (!infoPopup.length) {
    let infoMessage = '';
    if (polygonHover.length && cityAreaHover.length) {
      this.getCanvas().style.cursor = 'cell';
      infoMessage = 'Click the map to place the pin';
    } else {
      this.getCanvas().style.cursor = 'no-drop';
      infoMessage = 'Pin can only be placed in polygons';
    }
    const popUpInstance = new mapboxgl.Popup({
      offset: 15,
      closeButton: false,
      className: 'custom-pin-info-message'
    });
    const popupNode = document.createElement('div');

    ReactDOM.render(
      <CustomPointTooltip
        dataTestId="custom-pin-info-message"
        text={infoMessage}
      />,
      popupNode
    );
    popUpInstance
      .setLngLat([e.lngLat.lng, e.lngLat.lat])
      .setDOMContent(popupNode)
      .addTo(this);
  }
};

export const removeMarkerCreate = map => {
  const {
    id: { customPointsId, partnersAreasId, cityAreasLayerIdEdit }
  } = addLayer;

  if (map) {
    map.off('click', customPointsId, onClickMarker);
    map.off('click', partnersAreasId, onClickMarkerPlace);
    map.off('mousemove', cityAreasLayerIdEdit, customPinsToolTip);
    map.off('mousemove', cityAreasLayerIdEdit, customPinsToolTipPlace);
  }
};

export const addMarkerCreate = map => {
  const {
    id: { customPointsId, partnersAreasId, cityAreasLayerIdEdit }
  } = addLayer;

  if (map) {
    map.getCanvas().style.cursor = 'no-drop';
    map.on('click', customPointsId, onClickMarker);
    map.on('click', partnersAreasId, onClickMarkerPlace);
    map.on('mousemove', cityAreasLayerIdEdit, customPinsToolTip);
  }
};

///////////////////////////////////
//////// Manual add/remove ////////
//////////////////////////////////

const onClickManualEdit = function(e) {
  const pinSelection = document.getElementById('pin-selection-item');

  if (!pinSelection) {
    return;
  }

  const {
    type: { partnersAreasType }
  } = addSource;

  const userPolygon = e.features[0];
  const latLong = turf.centroid(e.features[0]).geometry.coordinates;

  // calculate intersections between click event and other partner areas
  const intersectingPartnerAreas = getIntersectingPartnerAreas(
    userPolygon,
    this.getSource(partnersAreasType)._data.features
  );

  // check whether the click event is inside an already defined partner area
  const containedInPartnerArea = isInsidePartnerArea(
    e.lngLat.lng,
    e.lngLat.lat,
    this.getSource(partnersAreasType)._data.features
  );

  const hasAddClass = e.originalEvent.target.classList.contains(
    'add-area-marker'
  );
  const hasRemoveClass = e.originalEvent.target.classList.contains(
    'remove-area-marker'
  );

  removeAllMarkers();
  if (!hasAddClass && !hasRemoveClass) {
    // create marker element
    const el = document.createElement('div');
    if (containedInPartnerArea) {
      el.className = 'remove-area-marker';
      el.addEventListener(
        'click',
        removeMarkerClickHandler(e, this, userPolygon, partnersAreasType)
      );
    } else {
      el.className = 'add-area-marker';
      el.addEventListener(
        'click',
        addMarkerClickHandler(
          e,
          this,
          userPolygon,
          partnersAreasType,
          intersectingPartnerAreas
        )
      );
    }
    // attach marker element
    new mapboxgl.Marker(el).setLngLat([latLong[0], latLong[1]]).addTo(this);
  }
};

export const removeManualEdit = map => {
  const {
    id: { cityAreasLayerIdEdit }
  } = addLayer;

  if (map) {
    map.off('click', cityAreasLayerIdEdit, onClickManualEdit);
  }
};

export const addManualEdit = map => {
  const {
    id: { cityAreasLayerIdEdit }
  } = addLayer;
  if (map) {
    map.on('click', cityAreasLayerIdEdit, onClickManualEdit);
  }
};
