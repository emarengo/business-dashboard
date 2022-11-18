import React from 'react';
import { Link } from 'react-router-dom';

import Styled from './styled';
import { IHeader } from '../types';

const Header: React.FC<IHeader> = ({
  city,
  cityOptions,
  onChangeCity,
  onSearchInput,
  onSearchClear,
  onCreateNew,
  onSave,
  onGoingBack,
  searchInput,
  submitText,
  title,
  uriBack
}) => {
  const handleGoingBack = (event: React.MouseEvent): void => {
    if (onGoingBack) {
      event.preventDefault();
      onGoingBack();
    }
  };

  return (
    <Styled.Header data-testid="header">
      <Styled.HeaderTitle data-testid="title">
        {uriBack ? (
          <Link to={uriBack} onClick={handleGoingBack}>
            {title}
          </Link>
        ) : (
          title
        )}
      </Styled.HeaderTitle>
      {onChangeCity && (
        <Styled.CityDropdown
          id="schedule-city"
          testId="dropdown-schedule-city"
          options={cityOptions}
          defaultSelected={city ? city.label : ''}
          size="small"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            onChangeCity({ value: event.target.value })
          }
        />
      )}
      {onSearchInput && (
        <Styled.Search data-testid="search">
          <Styled.SearchInput
            data-testid="search-input"
            placeholder="Search with vehicle plates or device code"
            onChange={onSearchInput}
            value={searchInput}
          />
          <Styled.SearchButton
            data-testid="search-button"
            asReset={Boolean(searchInput)}
            onClick={() => onSearchClear && onSearchClear()}
          />
        </Styled.Search>
      )}
      {onCreateNew && (
        <Styled.PlusButton
          data-testid="plus-button"
          onClick={() => onCreateNew()}
        />
      )}
      {submitText && (
        <Styled.Submit
          data-testid="submit-button"
          onClick={() => onSave && onSave()}
        >
          {submitText}
        </Styled.Submit>
      )}
    </Styled.Header>
  );
};

export default Header;
