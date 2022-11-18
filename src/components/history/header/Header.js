import React, { useEffect } from 'react';

import { useAppContext } from '../../../provider';

import Styled from './styled';
import { useParams } from 'react-router-dom';

export const Header = ({ history, onTimelineChange, onCityChange }) => {
  const [{ cities }] = useAppContext();
  const activeCity = useParams().city;

  useEffect(() => {
    onCityChange(activeCity);
  }, [activeCity]);
  const cityId = useParams().city;

  return (
    <Styled.HeaderContainer>
      <Styled.CityAreaInfoWrapper>
        <Styled.Heading>
          <Styled.BackButton
            testId="backBtn"
            onClick={() => history.push(`/geofence/${cityId}`)}
          />
          Version History
        </Styled.Heading>
      </Styled.CityAreaInfoWrapper>
      <Styled.HeaderActionsGroup>
        <Styled.CityDropdown
          id="cities"
          testId="dropdown-cities"
          value={activeCity}
          options={cities}
          size="small"
          onChange={({ target }) => onCityChange(target.value)}
        />
        <Styled.Dropdown
          id="history"
          testId="HistoryDropdown"
          value="week"
          options={[
            { label: 'Last 7 days', value: 'week', key: '0' },
            { label: 'Last 4 weeks', value: 'month', key: '1' }
          ]}
          size="small"
          onChange={({ target }) => onTimelineChange(target.value)}
        />
      </Styled.HeaderActionsGroup>
    </Styled.HeaderContainer>
  );
};
