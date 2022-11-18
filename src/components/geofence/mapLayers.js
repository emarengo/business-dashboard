import { addLayer } from './addLayer';
import { addSource } from './addSource';
import defaultMapTheme from './Themes';
import { v4 as uuidv4 } from 'uuid';

const {
  id: {
    partnersAreasId,
    partnersAreasBordersId,
    cityAreasLayerId,
    cityAreasBordersId,
    cityAreasLayerIdEdit,
    cityAreasBordersIdEdit,
    cityAreasBordersIdFilters,
    cityAreasBordersIdEditNoDots,
    customPointsId
  }
} = addLayer;
const {
  partnersAreas,
  cityAreas,
  cityAreasEdit,
  cityAreasView
} = defaultMapTheme;
const { partnersAreasType, cityAreasType, customPointsType } = addSource.type;

export const mapLayers = (map, isViewMode, {}, isHistoryMode = false) => {
  // Set all layers
  addLayer(
    partnersAreasId,
    'fill',
    partnersAreasType,
    partnersAreas.areaLayer,
    map,
    'visible'
  );

  addLayer(
    partnersAreasBordersId,
    'line',
    partnersAreasType,
    partnersAreas.borderLayer,
    map,
    'visible'
  );

  addLayer(
    cityAreasLayerId,
    'fill',
    'cityAreasView',
    cityAreas.areaLayer,
    map,
    'visible'
  );

  addLayer(
    cityAreasBordersId,
    'line',
    'cityAreasView',
    cityAreas.borderLayer,
    map,
    'visible'
  );

  addLayer(
    cityAreasLayerIdEdit,
    'fill',
    cityAreasType,
    cityAreasEdit.areaLayer,
    map
  );

  addLayer(
    cityAreasBordersIdEdit,
    'line',
    cityAreasType,
    cityAreasEdit.borderLayer,
    map
  );

  map.loadImage(
    'https://beat-general.s3.amazonaws.com/images/point-added@2x.png',
    function(error, image) {
      if (error) throw error;
      const imageIcon = uuidv4();
      map.addImage(imageIcon, image);

      addLayer(
        customPointsId,
        'symbol',
        customPointsType,
        {
          layout: {
            /// @TODO move this to theme ?
            visibility: 'visible',
            'icon-image': imageIcon,
            'icon-size': 0.4,
            'icon-allow-overlap': true
          }
        },
        map
      );
    }
  );

  addLayer(
    cityAreasBordersIdEditNoDots,
    'line',
    cityAreasType,
    cityAreasEdit.borderLayerNoDots,
    map
  );

  addLayer(
    cityAreasBordersIdFilters,
    'line',
    cityAreasType,
    cityAreasEdit.borderLayerFilters,
    map
  );

  // Change the visibility according to view mode
  if (!isViewMode) {
    map.setLayoutProperty(cityAreasLayerIdEdit, 'visibility', 'visible');
    map.setLayoutProperty(cityAreasBordersIdEdit, 'visibility', 'visible');
    map.setLayoutProperty(cityAreasBordersIdFilters, 'visibility', 'visible');
    map.setLayoutProperty(cityAreasLayerId, 'visibility', 'none');
    map.setLayoutProperty(cityAreasBordersId, 'visibility', 'none');
    map.setLayoutProperty(
      cityAreasBordersIdEditNoDots,
      'visibility',
      'visible'
    );

    map.moveLayer(partnersAreasId);
  }
  // Must make sure that edit layers are created
  if (
    isViewMode &&
    map.getLayer(cityAreasLayerIdEdit) &&
    map.getLayer(cityAreasLayerId)
  ) {
    map.setLayoutProperty(cityAreasBordersIdFilters, 'visibility', 'none');
    map.setLayoutProperty(cityAreasLayerIdEdit, 'visibility', 'none');
    map.setLayoutProperty(cityAreasBordersIdEdit, 'visibility', 'none');
    map.setLayoutProperty(cityAreasLayerId, 'visibility', 'visible');
    map.setLayoutProperty(cityAreasBordersId, 'visibility', 'visible');
    map.setLayoutProperty(cityAreasBordersIdEditNoDots, 'visibility', 'none');
  }
};
