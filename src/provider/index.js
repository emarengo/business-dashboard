import React, { createContext, useContext, useReducer } from 'react';

import { citiesReducer, mapBoxReducer } from './reducers';

export const AppContext = createContext();

export const initialState = {
  cities: [],
  mapContext: {}
};

export const mainReducer = (state, action) => ({
  ...state,
  cities: citiesReducer(state.cities, action),
  mapContext: mapBoxReducer(state.mapContext, action)
});

export const StateProvider = ({ reducer, initialState, children }) => (
  <AppContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </AppContext.Provider>
);

export const useAppContext = () => useContext(AppContext);
