import React from 'react';

import Styled from './styled';

import CityAreaInfoPane from '../cityAreaInfoPane/CityAreaInfoPane';
import EditMapActions from '../editMapActions/EditMapActions';
import ViewMapActions from '../viewMapActions/ViewMapActions';

export const Header = ({
  drawPolygonStatus,
  editGeofenceSuccessMessage,
  history,
  onCityChange,
  onViewChange,
  isViewMode,
  isEmptyArea,
  geofenceSumInfo,
  shouldRender,
  openFilters,
  map,
  draw,
  currentCity
}) => {
  return (
    <Styled.HeaderContainer>
      <Styled.CityAreaInfoWrapper>
        <Styled.Heading>
          {!isViewMode ? (
            <>
              <Styled.BackButton
                testId="backBtn"
                onClick={() => onViewChange(true)}
              />
              Edit geofenced area
            </>
          ) : (
            <>
              <Styled.Title>Geofenced area</Styled.Title>
              {isEmptyArea && (
                <Styled.NoAreasText>
                  There is no geofenced area for the selected city.
                </Styled.NoAreasText>
              )}
            </>
          )}
        </Styled.Heading>
        <CityAreaInfoPane
          drawPolygonStatus={drawPolygonStatus}
          map={map}
          draw={draw}
          compactView
          showPolygons
          showPercentages={!isViewMode}
          showActiveCityAreas
          isLightSkin
          geofenceSumInfo={geofenceSumInfo}
          currentCity={currentCity}
        />
      </Styled.CityAreaInfoWrapper>
      <Styled.HeaderActionsGroup>
        {!isViewMode && (
          <EditMapActions
            openFilters={openFilters}
            editGeofenceSuccessMessage={editGeofenceSuccessMessage}
            history={history}
            changeView={onViewChange}
          />
        )}
        {isViewMode && shouldRender && (
          <ViewMapActions
            onCityChange={onCityChange}
            onViewChange={onViewChange}
          />
        )}
      </Styled.HeaderActionsGroup>
    </Styled.HeaderContainer>
  );
};
