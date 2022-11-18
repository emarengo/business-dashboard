import React, { useEffect, useState } from 'react';

import Styled from './styled';

const CityAreaInfoPane = ({
  compactView,
  showPolygons,
  showPercentages,
  showActiveCityAreas,
  isLightSkin,
  feature = {},
  geofenceSumInfo,
  map,
  draw
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [initialState, setInitialState] = useState({});
  const [deltasState, setDeltasState] = useState({});
  const [prevDeltas, setPrevDeltas] = useState({});

  const {
    properties: {
      population,
      city_area,
      district,
      eta = 0,
      eyeballs = 0,
      etrc = 0.0,
      pickup_time = 0,
      requests_per_idle_time = 0.0
    } = {}
  } = feature;
  const id = feature && feature.id ? feature.id : 'metrics';

  const {
    statsPolygons = 0,
    statsActiveColonias = 0,
    statsPopulation = 0,
    statsEyeBalls = 0,
    statsEtrc = 0,
    statsEta = 0,
    statsPickupTime = 0,
    statsCityEyeballs = 0,
    statsPickUpRate = 0,
    statsRequestIdleTime = 0
  } = geofenceSumInfo || {};

  // Pass to the initial state our saved data so we can comparison them
  useEffect(() => {
    if (showPercentages) {
      setInitialState(geofenceSumInfo);

      // If we have no polygons then don't compute deltas
      if (!geofenceSumInfo.statsPolygons) {
        setInitialState({});
      }
    }
  }, [showPercentages]);

  useEffect(() => {
    if (showPercentages) {
      let deltaVaulues = {};

      // Loop on our new changes so we inform the deltas for changes
      if (Object.keys(initialState).length > 0) {
        Object.entries(geofenceSumInfo).map(function(key) {
          const currentKey = key[0];
          let initialStateValue;
          let percentagePointer;
          let currentChangesValue;

          currentChangesValue = geofenceSumInfo[currentKey];
          initialStateValue = initialState[currentKey];

          if (currentChangesValue !== initialStateValue) {
            // If current change is bigger than the initial we have positive otherwise negative value
            percentagePointer =
              currentChangesValue > initialStateValue ? 'up' : 'down';

            // In case of statsEta reverse the percentage pointer
            if (currentKey === 'statsEta') {
              percentagePointer =
                currentChangesValue > initialStateValue ? 'down' : 'up';
              currentChangesValue = geofenceSumInfo.statsEtaInMinutes;
              initialStateValue = initialState.statsEtaInMinutes;
            }

            // In case of statsPickupTime reverse the percentage pointer
            if (currentKey === 'statsPickupTime') {
              percentagePointer =
                currentChangesValue > initialStateValue ? 'down' : 'up';
              currentChangesValue = geofenceSumInfo.statsPickupTimeInMinutes;
              initialStateValue = initialState.statsPickupTimeInMinutes;
            }

            // Get the diff from the values of current and initial data
            const diff = currentChangesValue - initialStateValue;

            //Compute the percentage
            const percentage = (diff / initialStateValue) * 100;

            // Remove the negative sign if exists and round the number
            let deltaValue = Math.abs(percentage).toFixed(1);

            // statsActiveColonias and statsPolygons are simple numbers not percentage
            if (
              currentKey === 'statsActiveColonias' ||
              currentKey === 'statsPolygons'
            ) {
              deltaValue = Math.abs(diff);
            }

            // Update the computed values
            deltaVaulues[currentKey] = percentagePointer;
            deltaVaulues[`${[currentKey]}Value`] =
              parseInt(deltaValue) !== 0 && deltaValue;
          }
        });

        // TODO Temp solution, will be refactored
        // Here we use some classes to know the state of the drawing tool
        const polygonDrawn = document.getElementsByClassName('polygonDrawn');
        const removePolygon = document.getElementsByClassName('removePolygon');

        // Id a polygon is drawn we dont updated the deltas immediately, only when we actual accept the changes
        if (polygonDrawn.length > 0) {
          setPrevDeltas(deltaVaulues);
        }
        // In case we dont have drawn polygon proceed as normal
        if (removePolygon.length === 0 && polygonDrawn.length === 0) {
          setDeltasState(deltaVaulues);
        }

        // Once done remove the temp helper classes
        document.querySelector('body').classList.remove('addPolygon');
        document.querySelector('body').classList.remove('removePolygon');
        document.querySelector('body').classList.remove('polygonDrawn');
      } else {
        setDeltasState({});
      }
    }
  }, [geofenceSumInfo, initialState, showPercentages]);

  // Reset the deltas once unmount happens
  useEffect(() => {
    if (!showPercentages && compactView) {
      setDeltasState({});
      setInitialState({});
      setPrevDeltas({});
    }
  }, [showPercentages, compactView]);

  useEffect(() => {
    if (map && showPercentages) {
      map.once('click', () => {
        // If we have drawn polygon and we accept it, then pass the saved deltas to the proper state for usage
        const addPolygon = document.getElementsByClassName('addPolygon');

        if (addPolygon.length > 0) {
          setDeltasState(prevDeltas);
        }
      });
    }
  }, [map, showPercentages, prevDeltas, draw]);

  const createTimeStamp = number => {
    if (isNaN(number)) {
      return 0;
    }
    // Hours, minutes and seconds
    let hrs = ~~(number / 3600);
    let mins = ~~((number % 3600) / 60);
    let secs = ~~number % 60;

    let ret = '';

    if (hrs > 0) {
      ret += '' + hrs + ':' + (mins < 10 ? '0' : '');
    }

    ret += '' + mins + ':' + (secs < 10 ? '0' : '');
    ret += '' + secs;
    return ret;
  };

  const toCamelCase = str => {
    let out = '';
    str.split(' ').forEach(function(el, idx) {
      const add = el.toLowerCase();
      out += idx === 0 ? add : add[0] && add[0].toUpperCase() + add.slice(1);
    });

    const result = out.replace(/([A-Z])/g, ' $1');
    return result.charAt(0).toUpperCase() + result.slice(1);
  };

  const formatNumber = number =>
    number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  return (
    <Styled.Content
      compactView={compactView && !showPercentages}
      isLightSkin={isLightSkin}
      data-testid={`layer-popup-${id}`}
      id={`popup-${id}`}
      showPercentages={showPercentages}
    >
      <Styled.ExpandableContainer
        compactView={compactView}
        isExpanded={isExpanded}
        showPercentages={showPercentages}
      >
        {!compactView && (
          <>
            <Styled.DistrictName>{toCamelCase(city_area)}</Styled.DistrictName>
            <Styled.DistrictNameSubtitle>
              ( {toCamelCase(district)} )
            </Styled.DistrictNameSubtitle>
          </>
        )}
        {showPolygons && (
          <Styled.Group compactView={compactView}>
            <Styled.Icon icon="polygon" />
            <Styled.InnerGroup>
              <Styled.Title>
                {!showPercentages && (
                  <Styled.Subtitle>{statsPolygons}</Styled.Subtitle>
                )}
                Islands
              </Styled.Title>
              {showPercentages && (
                <Styled.Subtitle>{statsPolygons}</Styled.Subtitle>
              )}
              {showPercentages && deltasState.statsPolygonsValue && (
                <Styled.PercentageBox direction={deltasState.statsPolygons}>
                  {deltasState.statsPolygonsValue}
                </Styled.PercentageBox>
              )}
            </Styled.InnerGroup>
          </Styled.Group>
        )}
        {showActiveCityAreas && (
          <Styled.Group compactView={compactView}>
            <Styled.Icon icon="activeAreas" />
            <Styled.InnerGroup>
              <Styled.Title>
                {!showPercentages && (
                  <Styled.Subtitle>{statsActiveColonias}</Styled.Subtitle>
                )}
                Active colonias
              </Styled.Title>
              {showPercentages && (
                <Styled.Subtitle>{statsActiveColonias}</Styled.Subtitle>
              )}
              {showPercentages && deltasState.statsActiveColoniasValue && (
                <Styled.PercentageBox
                  direction={deltasState.statsActiveColonias}
                >
                  {deltasState.statsActiveColoniasValue}
                </Styled.PercentageBox>
              )}
              {!compactView && <Styled.Subtitle>9</Styled.Subtitle>}
            </Styled.InnerGroup>
          </Styled.Group>
        )}
        <Styled.Group compactView={compactView}>
          <Styled.Icon icon="population" />
          <Styled.InnerGroup>
            {compactView && showPercentages && 'Total population'}
            <Styled.Title>
              {compactView && (
                <Styled.Subtitle>
                  {formatNumber(statsPopulation)}
                </Styled.Subtitle>
              )}
              {!compactView && !showPercentages && 'Population'}
              {compactView && !showPercentages && 'Total population'}
            </Styled.Title>
            {!compactView && (
              <Styled.Subtitle>
                {isNaN(population) ? 0 : formatNumber(population)}
              </Styled.Subtitle>
            )}
            {showPercentages && deltasState.statsPopulationValue && (
              <Styled.PercentageBox direction={deltasState.statsPopulation}>
                {deltasState.statsPopulationValue}%
              </Styled.PercentageBox>
            )}
          </Styled.InnerGroup>
        </Styled.Group>
        <Styled.Group compactView={compactView}>
          <Styled.Icon icon="dailyEyeballs" />
          <Styled.InnerGroup>
            <Styled.Title>
              {compactView && !showPercentages && (
                <Styled.Subtitle>{formatNumber(statsEyeBalls)}</Styled.Subtitle>
              )}
              Daily Eyeballs
            </Styled.Title>
            {showPercentages && (
              <Styled.Subtitle>{formatNumber(statsEyeBalls)}</Styled.Subtitle>
            )}
            {!compactView && <Styled.Subtitle>{eyeballs}</Styled.Subtitle>}

            {showPercentages && deltasState.statsEyeBallsValue && (
              <Styled.PercentageBox direction={deltasState.statsEyeBalls}>
                {deltasState.statsEyeBallsValue}%
              </Styled.PercentageBox>
            )}
          </Styled.InnerGroup>
        </Styled.Group>
        <Styled.Group compactView={compactView}>
          <Styled.Icon icon="dailyRequests" />
          <Styled.InnerGroup>
            <Styled.Title>
              {compactView && !showPercentages && (
                <Styled.Subtitle>
                  {(statsEtrc &&
                    !Number.isInteger(statsEtrc) &&
                    statsEtrc.replace('.', ',')) ||
                    statsEtrc}
                  %
                </Styled.Subtitle>
              )}
              Daily ETRC
            </Styled.Title>
            {showPercentages && (
              <Styled.Subtitle>
                {(statsEtrc &&
                  !Number.isInteger(statsEtrc) &&
                  statsEtrc.replace('.', ',')) ||
                  statsEtrc}
                %
              </Styled.Subtitle>
            )}
            {showPercentages && deltasState.statsEtrcValue && (
              <Styled.PercentageBox direction={deltasState.statsEtrc}>
                {deltasState.statsEtrcValue}%
              </Styled.PercentageBox>
            )}
            {!compactView && (
              <Styled.Subtitle>
                {etrc.toString().replace('.', ',') || etrc}%
              </Styled.Subtitle>
            )}
          </Styled.InnerGroup>
        </Styled.Group>
        {compactView && (
          <Styled.Group compactView={compactView}>
            <Styled.Icon icon="dailyEyeballs" />
            <Styled.InnerGroup>
              <Styled.Title>
                {compactView && !showPercentages && (
                  <Styled.Subtitle>
                    {(!isNaN(statsCityEyeballs) &&
                      !Number.isInteger(statsCityEyeballs) &&
                      statsCityEyeballs.replace('.', ',')) ||
                      statsCityEyeballs}
                    %
                  </Styled.Subtitle>
                )}
                of city's Daily Eyeballs
              </Styled.Title>
              {compactView && showPercentages && (
                <Styled.Subtitle>
                  {(!isNaN(statsCityEyeballs) &&
                    !Number.isInteger(statsCityEyeballs) &&
                    statsCityEyeballs.replace('.', ',')) ||
                    statsCityEyeballs}
                  %
                </Styled.Subtitle>
              )}
              {showPercentages && deltasState.statsCityEyeballsValue && (
                <Styled.PercentageBox direction={deltasState.statsCityEyeballs}>
                  {deltasState.statsCityEyeballsValue}%
                </Styled.PercentageBox>
              )}
            </Styled.InnerGroup>
          </Styled.Group>
        )}
        <Styled.Group compactView={compactView}>
          <Styled.Icon icon="de" />
          <Styled.InnerGroup>
            <Styled.Title>
              {compactView && !showPercentages && (
                <Styled.Subtitle>
                  {statsEta && statsEta.replace('.', ':')}
                </Styled.Subtitle>
              )}
              Daily ETA
            </Styled.Title>
            {showPercentages && (
              <Styled.Subtitle>
                {statsEta && statsEta.replace('.', ':')}
              </Styled.Subtitle>
            )}

            {!compactView && (
              <Styled.Subtitle>{createTimeStamp(eta)}</Styled.Subtitle>
            )}
            {showPercentages && deltasState.statsEtaValue && (
              <Styled.PercentageBox direction={deltasState.statsEta}>
                {deltasState.statsEtaValue}%
              </Styled.PercentageBox>
            )}
          </Styled.InnerGroup>
        </Styled.Group>
        <Styled.Group compactView={compactView}>
          <Styled.Icon icon="dailyTts" />
          <Styled.InnerGroup>
            <Styled.Title>
              {compactView && !showPercentages && (
                <Styled.Subtitle>
                  {statsPickupTime && statsPickupTime.replace('.', ':')}
                </Styled.Subtitle>
              )}
              Daily Pick up-time
            </Styled.Title>

            {showPercentages && (
              <Styled.Subtitle>
                {statsPickupTime && statsPickupTime.replace('.', ':')}
              </Styled.Subtitle>
            )}
            {!compactView && (
              <Styled.Subtitle>{createTimeStamp(pickup_time)}</Styled.Subtitle>
            )}
            {showPercentages && deltasState.statsPickupTimeValue && (
              <Styled.PercentageBox direction={deltasState.statsPickupTime}>
                {deltasState.statsPickupTimeValue}%
              </Styled.PercentageBox>
            )}
          </Styled.InnerGroup>
        </Styled.Group>

        {compactView && (
          <Styled.Group compactView={compactView}>
            <Styled.Icon icon="pickUpRate" />
            <Styled.InnerGroup>
              <Styled.Title>
                {compactView && !showPercentages && (
                  <Styled.Subtitle>
                    {(!Number.isInteger(statsPickUpRate) &&
                      statsPickUpRate.replace('.', ',')) ||
                      statsPickUpRate}
                    %
                  </Styled.Subtitle>
                )}
                Daily Pick-up Rate
              </Styled.Title>
              {showPercentages && (
                <Styled.Subtitle>
                  {(!Number.isInteger(statsPickUpRate) &&
                    statsPickUpRate.replace('.', ',')) ||
                    statsPickUpRate}
                  %
                </Styled.Subtitle>
              )}

              {showPercentages && deltasState.statsPickUpRateValue && (
                <Styled.PercentageBox direction={deltasState.statsPickUpRate}>
                  {deltasState.statsPickUpRateValue}%
                </Styled.PercentageBox>
              )}
            </Styled.InnerGroup>
          </Styled.Group>
        )}
        <Styled.Group compactView={compactView}>
          <Styled.Icon icon="dailyRequests" longText={true} />
          <Styled.InnerGroup>
            <Styled.Title longText={true}>
              {compactView && !showPercentages && (
                <Styled.Subtitle>
                  {(statsRequestIdleTime &&
                    !Number.isInteger(statsRequestIdleTime) &&
                    statsRequestIdleTime.replace('.', ',')) ||
                    statsRequestIdleTime}
                  %
                </Styled.Subtitle>
              )}
              Requests per idle available hour
            </Styled.Title>
            {showPercentages && (
              <Styled.Subtitle>
                {(statsRequestIdleTime &&
                  !Number.isInteger(statsRequestIdleTime) &&
                  statsRequestIdleTime.replace('.', ',')) ||
                  statsRequestIdleTime}
                %
              </Styled.Subtitle>
            )}
            {showPercentages && deltasState.statsRequestIdleTimeValue && (
              <Styled.PercentageBox
                direction={deltasState.statsRequestIdleTime}
              >
                {deltasState.statsRequestIdleTimeValue}%
              </Styled.PercentageBox>
            )}
            {!compactView && (
              <Styled.Subtitle>
                {requests_per_idle_time.toString().replace('.', ',') ||
                  requests_per_idle_time}
                %
              </Styled.Subtitle>
            )}
          </Styled.InnerGroup>
        </Styled.Group>
      </Styled.ExpandableContainer>
      {compactView && (
        <Styled.ExpandButton
          isExpanded={isExpanded}
          onClick={() => {
            setIsExpanded(!isExpanded);
          }}
        >
          {isExpanded ? 'Show less' : 'Show more'}
        </Styled.ExpandButton>
      )}
    </Styled.Content>
  );
};

export default CityAreaInfoPane;
