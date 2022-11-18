import React, { useEffect, useState } from 'react';

import { Checkbox } from '@thebeatapp/beat-ui';
import { useAppContext } from '../../../provider';
import Styled from './styled';

export const Filters = ({ openFilters, cityFilters, citiesSourcesAreas }) => {
  const [changesMade, setChangesMade] = useState(false);
  const [resetFilters, setResetFilters] = useState(false);
  const [markersFilterChecked, setMarkersFilterChecked] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [{ mapContext }, dispatch] = useAppContext();
  const { map } = mapContext || {};

  const belongsToFilter = (arr, target) => target.some(v => arr.includes(v));
  const resetFiltersState = source => {
    for (let i = 0; i < source.features.length; i++) {
      if (
        source.features[i].properties.zone_cat_new !== undefined &&
        source.features[i].properties.zone_cat_new !== '[Null]'
      ) {
        map.setFeatureState(
          { source: 'cityAreas', id: source.features[i].id },
          { filterOn: false }
        );
      }
    }
  };

  useEffect(() => {
    if (changesMade) {
      if (selectedFilters.length === 0) {
        resetFiltersState(citiesSourcesAreas);
        setResetFilters(false);
      }
      if (selectedFilters.length !== 0) {
        for (let i = 0; i < citiesSourcesAreas.features.length; i++) {
          if (
            citiesSourcesAreas.features[i].properties.zone_cat_new !==
              undefined &&
            citiesSourcesAreas.features[i].properties.zone_cat_new !==
              '[Null]' &&
            belongsToFilter(
              citiesSourcesAreas.features[i].properties.zone_cat_new,
              selectedFilters
            )
          ) {
            map.setFeatureState(
              { source: 'cityAreas', id: citiesSourcesAreas.features[i].id },
              { filterOn: true }
            );
          }
        }
      }
    }

    return () => resetFiltersState(citiesSourcesAreas);
  }, [changesMade, selectedFilters, citiesSourcesAreas, map]);

  useEffect(() => {
    if (changesMade && resetFilters) {
      resetFiltersState(citiesSourcesAreas);

      setSelectedFilters([]);
    }
  }, [resetFilters, citiesSourcesAreas, changesMade]);

  useEffect(() => {
    setChangesMade(true);

    if (markersFilterChecked) {
      map.setLayoutProperty('custom-points-layer', 'visibility', 'visible');
    } else {
      map.setLayoutProperty('custom-points-layer', 'visibility', 'none');
    }
  }, [markersFilterChecked]);

  const handleFilter = filter => {
    setChangesMade(true);
    if (selectedFilters.includes(filter)) {
      const newArr = selectedFilters.filter(e => e !== filter);
      setSelectedFilters(newArr);
    } else {
      setSelectedFilters([...selectedFilters, filter]);
    }
  };

  const filters = filters => {
    return filters.map(filter => (
      <Styled.FilterContainer
        data-testid={`filter-${filter.name}`}
        key={filter.name}
      >
        <Checkbox
          className={
            selectedFilters.includes(filter.name)
              ? 'checkbox checked'
              : 'checkbox'
          }
          isChecked={selectedFilters.includes(filter.name)}
          onClick={() => handleFilter(filter.name)}
        >
          {filter.name}
        </Checkbox>
      </Styled.FilterContainer>
    ));
  };

  return (
    <>
      <Styled.FilterWrap data-testid="FilterWrap" openFilters={openFilters}>
        <Styled.FiltersHeader>
          <Styled.FiltersTitle>Filters</Styled.FiltersTitle>
          {selectedFilters.length !== 0 && (
            <Styled.FiltersReset
              data-testid="FiltersReset"
              onClick={() => {
                setResetFilters(true);
                setMarkersFilterChecked(true);
              }}
            >
              Reset all
            </Styled.FiltersReset>
          )}
        </Styled.FiltersHeader>
        <Styled.FiltersCategoriesTitle>
          Socioeconomic categories
        </Styled.FiltersCategoriesTitle>
        {cityFilters.length > 0 && filters(cityFilters)}

        <Styled.FiltersCategoriesTitle>Markers</Styled.FiltersCategoriesTitle>
        <Styled.Contain
          data-testid="FilterMarker"
          markersFilterChecked={markersFilterChecked}
          onClick={() => {
            setMarkersFilterChecked(!markersFilterChecked);
          }}
        >
          <Styled.RingsWrap markersFilterChecked={markersFilterChecked}>
            <Styled.Outer>
              <Styled.Middle>
                <Styled.Inner markersFilterChecked={markersFilterChecked} />
              </Styled.Middle>
            </Styled.Outer>
          </Styled.RingsWrap>
        </Styled.Contain>
        <Styled.MarkerTitle>Custom points</Styled.MarkerTitle>
      </Styled.FilterWrap>
    </>
  );
};
