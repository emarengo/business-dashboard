import React from 'react';
import { useParams } from 'react-router-dom';
import { useAppContext } from '../../../provider';

import Styled from './styled';

const ViewMapActions = ({ onCityChange, onViewChange }) => {
  const [{ cities }] = useAppContext() || {};
  const activeCity = useParams().city;

  return (
    <Styled.ViewActions>
      <Styled.CityDropdown
        id="cities"
        testId="dropdown-cities"
        value={activeCity}
        options={cities}
        size="small"
        onChange={({ target }) => onCityChange(target.value)}
      />
      <Styled.ButtonWrapper>
        <Styled.ExpandableButton
          data-testid="editBtn"
          onClick={() => onViewChange(false)}
          label="Edit"
        />
      </Styled.ButtonWrapper>
    </Styled.ViewActions>
  );
};

export default ViewMapActions;
