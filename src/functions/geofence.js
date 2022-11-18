import * as turf from '@turf/turf';
import ReactDOM from 'react-dom';
import React from 'react';

import { addSource } from '../components/geofence/addSource';

const polygonBuffer = 0.02;

export const drawCreate = (map, layer, event) => {
  /**
   * @see <a href="https://github.com/charliedotau/mapbox-gl-js-select-features-by-draw</a>
   */
  const userPolygon = event.features[0];
  // This is a number we provide to enlarge polygons so we make sure they intersect

  // Generate bounding box from polygon the user drew
  const polygonBoundingBox = turf.bbox(userPolygon);
  const southWest = [polygonBoundingBox[0], polygonBoundingBox[1]];
  const northEast = [polygonBoundingBox[2], polygonBoundingBox[3]];

  // Create east west points from bbox, so we can use queryRenderedFeatures function
  const northEastPointPixel = map.project(northEast);
  const southWestPointPixel = map.project(southWest);

  const features = map.queryRenderedFeatures(
    [southWestPointPixel, northEastPointPixel],
    { layers: [layer] }
  );

  return features.reduce((acc, feature) => {
    const selfIntersection = turf.kinks(userPolygon);

    // Get all the city areas that are included in the drawn area
    if (!selfIntersection.features[0] && turf.intersect(feature, userPolygon)) {
      const cityAreaExists = acc.find(
        cityArea => cityArea.properties.colonia_index === feature.id
      );
      // Make sure we haven't stored the city area already
      if (!cityAreaExists) {
        acc.push(turf.buffer(feature, polygonBuffer, { units: 'kilometers' }));
      }
    }
    return acc;
  }, []);
};

export const unifyPolygons = (map, selectedArea, source, initialState) => {
  let unifiedPolygon = {};

  if (selectedArea.length) {
    let unifiedCityAreas = turf.union(...selectedArea);
    if (unifiedCityAreas.geometry.type === 'MultiPolygon') return null;
    // Get all city id's from city areas
    const cityIds = selectedArea.map(
      ({ properties: { city_area_index } }) => city_area_index
    );

    // Check if unified city areas intersects with a partner area polygon
    const isMultiIntersected = initialState.reduce((acc, partnerArea) => {
      if (
        partnerArea.geometry.type !== 'Point' &&
        turf.intersect(unifiedCityAreas, partnerArea)
      ) {
        acc.push(partnerArea);
      }
      return acc;
    }, []);
    const uniqId = uuid();

    unifiedCityAreas = {
      ...unifiedCityAreas,
      properties: { city_area_ids: cityIds, polygon_id: uniqId }
    };

    unifiedPolygon = {
      ...unifiedPolygon,
      features: [{ ...unifiedCityAreas }, ...initialState]
    };
    // We have a MultiIntersected polygon, if unified city areas intersect with partner area
    if (isMultiIntersected.length) {
      let intersectedPolygons = turf.union(
        ...isMultiIntersected,
        unifiedCityAreas
      );
      if (intersectedPolygons.geometry.type === 'MultiPolygon') return null;

      // We must remove the existing city areas from the initial state, to avoid duplicate layer rendering
      const removeMergedPartnerAreas = initialState.filter(
        feature => ![...isMultiIntersected].includes(feature)
      );
      const uniqId = uuid();

      const removeDuplicateIds = [
        ...cityIds,
        ...intersectedPolygons.properties.city_area_ids
      ];
      const newIds = [...new Set(removeDuplicateIds)];

      intersectedPolygons = {
        ...intersectedPolygons,
        properties: {
          city_area_ids: newIds,
          polygon_id: uniqId
        }
      };
      unifiedPolygon = {
        ...unifiedPolygon,
        features: [{ ...intersectedPolygons }, ...removeMergedPartnerAreas]
      };
    }

    return {
      type: 'FeatureCollection',
      ...unifiedPolygon
    };
  }
};

export const createPopup = (map, Component, feature, event, popUpRef) => {
  // Create a div and assign it our component
  const popupNode = document.createElement('div');
  ReactDOM.render(<Component feature={feature} />, popupNode);

  // Add to map our created div
  popUpRef.current
    .setLngLat(event.lngLat)
    .setDOMContent(popupNode)
    .addTo(map);
};

export const isDrawing = draw => draw.getMode() === 'draw_polygon';

export const removeAllMarkers = () => {
  // check if any markers are set and remove them
  if (document.getElementsByClassName('add-area-marker')[0]) {
    document.getElementsByClassName('add-area-marker')[0].remove();
  }
  if (document.getElementsByClassName('remove-area-marker')[0]) {
    document.getElementsByClassName('remove-area-marker')[0].remove();
  }
  const popupInfo = document.getElementsByClassName('custom-pin-info-message');
  if (popupInfo.length) {
    popupInfo[0].remove();
  }
  const popupDrop = document.getElementsByClassName('custom-pin-drop-message');
  if (popupDrop.length) {
    popupDrop[0].remove();
  }
};

export const removeAllPopups = () => {
  const popupDrop = document.getElementsByClassName(
    'custom-point-actions-popup'
  );
  if (popupDrop.length) {
    popupDrop[0].remove();
  }
};

export const addBuffer = feature =>
  turf.buffer(feature, polygonBuffer, { units: 'kilometers' });

export const getIntersectingPartnerAreas = (targetPolygon, polygons) => {
  let intersections = [];
  polygons.forEach(polygon => {
    if (polygon.geometry.type === 'Polygon') {
      const intersect = turf.intersect(addBuffer(targetPolygon), polygon);
      if (intersect) {
        intersections.push(polygon);
      }
    }
  });
  return intersections;
};

export const isInsidePartnerArea = (lng, lat, polygons) => {
  let containedInPartnerArea;
  polygons.forEach(partnerAreaPolygon => {
    if (partnerAreaPolygon.geometry.type === 'Polygon') {
      const isInsidePartnerArea = turf.inside(
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [lng, lat]
          }
        },
        partnerAreaPolygon
      );
      if (isInsidePartnerArea) {
        containedInPartnerArea = partnerAreaPolygon;
      }
    }
  });
  return containedInPartnerArea;
};

export const splitMultiPolygon = (
  multiPolygon,
  partnerAreaCityIds,
  cityAreas
) => {
  const splitResult = [];
  multiPolygon.geometry.coordinates.forEach(function(coords) {
    var feat = {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: coords
      },
      properties: {
        city_area_ids: [],
        polygon_id: uuid()
      }
    };
    splitResult.push(feat);
  });

  partnerAreaCityIds.forEach(cityId => {
    const cityArea = cityAreas.find(o => o.id === cityId);
    const latLong = turf.centroid(cityArea).geometry.coordinates;
    splitResult.forEach((polygon, i) => {
      const point = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [latLong[0], latLong[1]]
        }
      };
      if (turf.inside(point, polygon)) {
        splitResult[i].properties.city_area_ids.push(cityId);
      }
    });
  });
  return splitResult;
};

export const setPartnerAreas = (map, partnerAreas, partnersAreasType) => {
  removeAllMarkers();
  if (partnerAreas) {
    map.getSource(partnersAreasType).setData(partnerAreas);
  }
};

export const addMarkerClickHandler = (
  event,
  map,
  userPolygon,
  partnersAreasType,
  intersectingPartnerAreas
) =>
  function(e) {
    const initialState = map.getSource(partnersAreasType)._data.features;
    let newData;
    let unifiedPolygon = addBuffer(userPolygon);
    let newCityAreaIds = [userPolygon.id];
    const partnerAreasToRemove = [];
    intersectingPartnerAreas.forEach(partnerArea => {
      if (partnerArea) {
        partnerAreasToRemove.push(partnerArea.properties.polygon_id);
        unifiedPolygon = turf.union(unifiedPolygon, partnerArea);
        newCityAreaIds = [
          ...newCityAreaIds,
          ...partnerArea.properties.city_area_ids
        ];
        unifiedPolygon.properties = {
          ...partnerArea.properties,
          polygon_id: uuid(),
          city_area_ids: newCityAreaIds
        };
        let featuresWithoutMerged = [...initialState];
        partnerAreasToRemove.forEach(polygonId => {
          featuresWithoutMerged = featuresWithoutMerged.filter(
            o => o.properties.polygon_id !== polygonId
          );
        });

        newData = {
          type: 'FeatureCollection',
          features: [{ ...unifiedPolygon }, ...featuresWithoutMerged]
        };
      }
    });
    if (intersectingPartnerAreas.length === 0) {
      {
        newData = {
          type: 'FeatureCollection',
          features: [
            ...initialState,
            {
              geometry: addBuffer(userPolygon).geometry,
              properties: {
                city_area_ids: [userPolygon.id],
                polygon_id: uuid()
              },
              type: userPolygon.type
            }
          ]
        };
      }
    }
    setPartnerAreas(map, newData, partnersAreasType);
  }.bind(userPolygon, intersectingPartnerAreas);

export const removeMarkerClickHandler = (
  event,
  map,
  userPolygon,
  partnersAreasType
) =>
  function(e) {
    let newPolygon;
    const initialState = map.getSource(partnersAreasType)._data.features;
    const cityAreas = map.getSource('cityAreas')._data.features;
    let newData;

    initialState.forEach(partnerArea => {
      const partnerAreaCityIds = partnerArea.properties.city_area_ids;
      if (
        partnerArea &&
        partnerArea.geometry.type === 'Polygon' &&
        partnerAreaCityIds.length !== 0 &&
        partnerAreaCityIds.includes(userPolygon.id)
      ) {
        // single partnerArea just filterOUT
        if (partnerAreaCityIds.length === 1) {
          newData = {
            type: 'FeatureCollection',
            features: [
              ...initialState.filter(
                o =>
                  o.geometry.type === 'Polygon' &&
                  o.properties.city_area_ids[0] !== userPolygon.id
              )
            ]
          };
        } else {
          const newCityAreaIds = [];
          partnerAreaCityIds.forEach(cityAreaId => {
            if (cityAreaId !== userPolygon.id) {
              const cityArea = cityAreas.find(o => o.id === cityAreaId);
              newCityAreaIds.push(cityAreaId);
              if (newPolygon) {
                newPolygon = turf.union(newPolygon, addBuffer(cityArea));
              } else {
                newPolygon = addBuffer(cityArea);
              }
            }
          });

          newPolygon.properties = {
            ...partnerArea.properties,
            polygon_id: uuid(),
            city_area_ids: [...newCityAreaIds]
          };

          const featuresWithoutMerged = initialState.filter(
            o => o.properties.city_area_ids !== partnerAreaCityIds
          );

          if (newPolygon.geometry.type === 'MultiPolygon') {
            newData = {
              type: 'FeatureCollection',
              features: [
                ...splitMultiPolygon(newPolygon, partnerAreaCityIds, cityAreas),
                ...featuresWithoutMerged
              ]
            };
          } else {
            newData = {
              type: 'FeatureCollection',
              features: [{ ...newPolygon }, ...featuresWithoutMerged]
            };
          }
        }
      }
    });
    //REMOVE ANY CUSTOM POINT
    const { customPointsType } = addSource.type;
    const currentMarkers = map.getSource(customPointsType);

    map.getSource(customPointsType).setData({
      type: 'FeatureCollection',
      features: [
        ...currentMarkers._data.features.filter(
          o => o.properties.city_area_id !== userPolygon.id
        )
      ]
    });
    //REMOVE ANY CUSTOM POINT

    setPartnerAreas(map, newData, partnersAreasType);
  }.bind(userPolygon);

// Random key generate with limited length to 9
export const uuid = () => {
  return 'xxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const setWithExpiry = (key, value, ttl) => {
  const now = new Date();

  // `item` is an object which contains the original value
  // as well as the time when it's supposed to expire
  const item = {
    value,
    expiry: now.getTime() + ttl
  };
  localStorage.setItem(key, JSON.stringify(item));
};

export const getWithExpiry = key => {
  const itemStr = localStorage.getItem(key);
  // if the item doesn't exist, return null
  if (!itemStr) {
    return null;
  }
  const item = JSON.parse(itemStr);
  const now = new Date();
  // compare the expiry time of the item with the current time
  if (now.getTime() > item.expiry) {
    // If the item is expired, delete the item from storage
    // and return null
    localStorage.removeItem(key);
    return null;
  }
  return item.value;
};
