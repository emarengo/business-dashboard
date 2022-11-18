import React from 'react';
import styled from '@emotion/styled/macro';

import { addSource } from '../addSource';
import { addLayer } from '../addLayer';
import { isInsidePartnerArea } from '../../../functions/geofence';
import {
  onClickMarker,
  onClickMarkerPlace,
  customPinsToolTip,
  customPinsToolTipPlace
} from '../mapEvents/editModeEvents';

const ToolTip = styled.div`
  height: 130px;
  width: 218px;
`;

const LatLng = styled.div`
  padding: 12px;
  border-radius: 6px;
  display: flex;
  justify-content: space-between;
  background-color: #43647c;
`;

const LatLngDetail = styled.div`
  color: white;
  width: 91px;
  text-align: center;
  font-family: Jost;
  font-size: 12px;
  font-weight: 600;
  border-radius: 4px;
  line-height: 1;
  background-color: rgba(255, 255, 255, 0.09);
  padding: 6px 0 9px 0;
`;

const Label = styled.div`
  font-size: 8px;
  font-weight: 500;
  line-height: 1.25;
  margin-bottom: 7px;
`;

const ActionImage = styled.span`
  width: 54px;
  height: 54px;
  display: inline-block;
  cursor: pointer;
  background-image: url(${({ action }) =>
    action === 'move'
      ? 'https://beat-general.s3.amazonaws.com/images/move@2x.png'
      : 'https://beat-general.s3.amazonaws.com/images/delete@2x.png'});
  background-size: 54px 54px;
  margin: 8px 10px 10px 0px;
`;

const CustomPointPopup = ({ feature, map, dataTestId }) => {
  const { id, lat, lng } = feature.properties;
  const { customPointsType, customPointsTypeTemp } = addSource.type;

  const removeMarker = () => {
    const currentMarkers = map.getSource(customPointsType);

    map.getSource(customPointsType).setData({
      type: 'FeatureCollection',
      features: [
        ...currentMarkers._data.features.filter(o => o.properties.id !== id)
      ]
    });

    //Reset temp state
    map.getSource(customPointsTypeTemp).setData({
      type: 'FeatureCollection',
      features: []
    });

    const popup = document.getElementsByClassName('custom-point-actions-popup');
    if (popup.length) {
      popup[0].remove();
    }
  };
  const moveMarker = () => {
    const {
      id: { customPointsId, partnersAreasId, cityAreasLayerIdEdit }
    } = addLayer;

    map.off('click', customPointsId, onClickMarker);
    map.off('click', partnersAreasId, onClickMarkerPlace);
    map.off('mousemove', cityAreasLayerIdEdit, customPinsToolTip);
    map.on('mousemove', cityAreasLayerIdEdit, customPinsToolTipPlace);

    map.getCanvas().style.cursor = 'grab';

    const popup = document.getElementsByClassName('custom-point-actions-popup');
    if (popup.length) {
      popup[0].remove();
    }

    const currentMarkers = map.getSource(customPointsType);
    const index = currentMarkers._data.features.findIndex(
      o => o.properties.id === id
    );

    //remove marker
    map.getSource(customPointsType).setData({
      type: 'FeatureCollection',
      features: [
        ...currentMarkers._data.features.filter(o => o.properties.id !== id)
      ]
    });
    //remove marker

    const onMouseMove = function(e) {
      var coords = e.lngLat;
      currentMarkers._data.features[index].geometry.coordinates = [
        coords.lng,
        coords.lat
      ];
      this.getSource(customPointsType).setData({
        type: 'FeatureCollection',
        features: [...currentMarkers._data.features]
      });
    };

    const repositionMarker = function(e) {
      const isCustomPointsMode = document
        .getElementById('pin-selection-item')
        .className.includes('active');
      if (isCustomPointsMode) {
        // recalculate marker properties
        const userPolygon = e.features[0];

        const { cityAreasType } = addSource.type;
        // find cityArea the marker is contained in
        const parentCityArea = isInsidePartnerArea(
          e.lngLat.lng,
          e.lngLat.lat,
          this.getSource(cityAreasType)._data.features
        );

        currentMarkers._data.features[index].properties = {
          ...currentMarkers._data.features[index].properties,
          city_area_id: parentCityArea.id,
          polygon_id: userPolygon.properties.polygon_id
        };

        // update marker properties
        this.getSource(customPointsType).setData({
          type: 'FeatureCollection',
          features: [...currentMarkers._data.features]
        });

        this.on('click', customPointsId, onClickMarker);
        this.on('click', partnersAreasId, onClickMarkerPlace);
        this.on('mousemove', cityAreasLayerIdEdit, customPinsToolTip);
      }
      // this.off('mousemove', partnersAreasId, onMouseMove);
      this.off('mousemove', cityAreasLayerIdEdit, customPinsToolTipPlace);
      this.off('click', partnersAreasId, repositionMarker);
    };

    // map.on('mousemove', partnersAreasId, onMouseMove);
    map.once('click', partnersAreasId, repositionMarker);
  };

  return (
    <ToolTip id={`custom-point-popup-${id}`} data-testid={dataTestId}>
      <LatLng>
        <LatLngDetail data-testid="custom-point-lat">
          <Label>Latitude</Label>
          {lat.toString().substr(0, 7)}
        </LatLngDetail>
        <LatLngDetail data-testid="custom-point-lng">
          <Label>Longtitude</Label>
          {lng.toString().substr(0, 7)}
        </LatLngDetail>
      </LatLng>
      <ActionImage action="move" data-testid="move-btn" onClick={moveMarker} />
      <ActionImage
        action="delete"
        data-testid="remove-btn"
        onClick={removeMarker}
      />
    </ToolTip>
  );
};

export default CustomPointPopup;
