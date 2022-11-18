import React from 'react';

import Styled from 'components/drivers/styled';
import { IHeader } from 'components/types';

const ShiftsHeader: React.FC<IHeader> = ({
  currentShifts,
  driversFilter,
  searchInput,
  services,
  onChangeDriverFilterOption,
  onChangeService,
  onHandleKeyDown,
  onSearchInput
}) => (
  <Styled.ShiftsHeader>
    <Styled.Search>
      <Styled.SearchInput
        placeholder="Search with Driver ID or Name"
        onChange={onSearchInput}
        value={searchInput}
        onKeyDown={onHandleKeyDown}
      />
      <Styled.SearchButton />
    </Styled.Search>
    {currentShifts && (
      <Styled.ShiftsFiltersContainer>
        {onChangeService && (
          <Styled.ServicesDropdown
            id="all-services"
            testId="dropdown-all-services"
            options={services}
            defaultSelected="All services"
            size="small"
            onChange={onChangeService}
          />
        )}
        <Styled.DriversDropdown
          id="drivers-filter"
          testId="dropdown-drivers-filter"
          size="small"
          defaultSelected="All drivers"
          options={driversFilter}
          onChange={onChangeDriverFilterOption}
        />
      </Styled.ShiftsFiltersContainer>
    )}
  </Styled.ShiftsHeader>
);

export default ShiftsHeader;
