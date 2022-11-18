import React from 'react';

import CityArea from '../cityArea';
import { partnersAreasLeave, partnersAreasMove } from '../partnersAreas';
import CityAreaInfoPane from '../cityAreaInfoPane/CityAreaInfoPane';
import { addLayer } from '../addLayer';
import { createPopup } from '../../../functions/geofence';

/**
 * @see <a href="https://docs.mapbox.com/mapbox-gl-js/example/hover-styles/</a>
 */

export const viewTabEvents = (map, popUpRef) => {
  const {
    id: { partnersAreasId },
    events: { mouse_move, mouse_leave }
  } = addLayer;

  if (map) {
    const cityArea = new CityArea(map);
    // Need to know if we hover over partnersArea
    map.on(mouse_move, partnersAreasId, () => partnersAreasMove(map));

    // // When leave partnersArea, reset our flag value
    map.on(mouse_leave, partnersAreasId, () => {
      partnersAreasLeave(map, cityArea.getId(), 'cityAreasView');
    });

    map.on(mouse_move, 'cityAreas-addLayer', event => {
      const {
        features: [polygon]
      } = event;

      cityArea.onMouseOver(polygon.id, 'cityAreasView', map =>
        createPopup(map, CityAreaInfoPane, polygon, event, popUpRef)
      );
    });

    // When leave partnersArea, reset our flag value
    map.on(mouse_leave, 'cityAreas-addLayer', () => popUpRef.current.remove());
  }
};
