export const addSource = (source, data, map) => {
  if (map) {
    map.on('load', function() {
      map.addSource(source, {
        type: 'geojson',
        lineMetrics: true,
        data
      });
    });
  }
};

addSource.type = {
  partnersAreasType: 'partnersAreas',
  partnersAreasTypeTemp: 'partnersAreasTemp',
  customPointsType: 'customPoints',
  customPointsTypeTemp: 'customPointsTemp',
  cityAreasType: 'cityAreas',
  cityAreasTypeView: 'cityAreasView',
  drawnArea: 'drawnArea',
  initialStateSource: 'initialStateSource'
};
