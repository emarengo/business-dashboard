export const addLayer = (id, type, source, layer, map, visibility = 'none') => {
  if (map) {
    map.on('load', function() {
      map.addLayer({
        id,
        type,
        source,
        layout: { visibility },
        ...layer
      });
    });
  }
};

addLayer.events = {
  mouse_move: 'mousemove',
  mouse_leave: 'mouseleave',
  click: 'click',
  draw_create: 'draw.create'
};

addLayer.id = {
  partnersAreasId: 'partners-areas-addLayer',
  partnersAreasBordersId: 'partners-areas-border-addLayer',
  cityAreasLayerId: 'cityAreas-addLayer',
  cityAreasBordersId: 'cityAreas-borders-addLayer',
  cityAreasLayerIdEdit: 'cityAreas-addLayer-edit',
  cityAreasLayerView: 'cityAreas-addLayer-view',
  cityAreasBordersIdEdit: 'cityAreas-borders-addLayer-edit',
  cityAreasBordersIdFilters: 'cityAreas-borders-addLayer-filters',
  cityAreasBordersIdEditNoDots: 'cityAreas-borders-addLayer-edit-no-dots',
  customPointsId: 'custom-points-layer',
  drawnAreaLayer: 'drawn-area',
  initialStateLayer: 'initialStateLayer'
};
