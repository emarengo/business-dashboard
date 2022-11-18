import { addSource } from './addSource';

export const mapSources = (
  map,
  partnersAreas,
  cityAreas,
  customPoints,
  isHistoryMode = false
) => {
  const {
    partnersAreasType,
    cityAreasType,
    customPointsType,
    partnersAreasTypeTemp,
    customPointsTypeTemp
  } = addSource.type;

  const customPointsPayload = customPoints ? customPoints : [];

  const newCustomPoints =
    partnersAreas &&
    partnersAreas.features &&
    [...partnersAreas.features].reduce((acc, feature) => {
      if (feature.geometry.type === 'Point') {
        acc.push(feature);
      }
      return acc;
    }, []);

  const pointsPayload = isHistoryMode ? newCustomPoints : customPointsPayload;

  addSource(partnersAreasType, partnersAreas, map);

  addSource(
    'drawnArea',
    {
      type: 'FeatureCollection',
      features: []
    },
    map
  );

  addSource(
    'initialStateSource',
    {
      type: 'FeatureCollection',
      features: []
    },
    map
  );

  addSource(partnersAreasTypeTemp, partnersAreas, map);

  addSource(cityAreasType, cityAreas, map);

  addSource(
    'cityAreasView',
    {
      type: 'FeatureCollection',
      features: []
    },
    map
  );

  addSource(
    customPointsType,
    {
      type: 'FeatureCollection',
      features: [...pointsPayload]
    },
    map
  );

  addSource(
    customPointsTypeTemp,
    {
      type: 'FeatureCollection',
      features: []
    },
    map
  );
};
