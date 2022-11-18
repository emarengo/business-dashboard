import { addLayer } from './addLayer';

const {
  id: { partnersAreasId, partnersAreasBordersId }
} = addLayer;

export const partnersAreasLeave = (map, cityAreaId, source) => {
  // On partnersArea mouse leave reset highlighted cityArea state
  if (cityAreaId) {
    map.setFeatureState(
      { source: source, id: cityAreaId },
      { selected: false }
    );
  }

  // Styling changes on partnersArea and borders
  map.setPaintProperty(
    partnersAreasId,
    'fill-color',
    'rgba(41, 104, 131, 0.55)'
  );
  map.setPaintProperty(partnersAreasBordersId, 'line-color', '#29d1d9');
};

export const partnersAreasMove = map => {
  map.setPaintProperty(
    partnersAreasId,
    'fill-color',
    'rgba(41, 104, 131, 0.25)'
  );
  map.setPaintProperty(
    partnersAreasBordersId,
    'line-color',
    'rgba(41,209,217,0.55)'
  );
};
