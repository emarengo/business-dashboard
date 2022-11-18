export default (state, { type, payload }) => {
  switch (type) {
    case 'SET_CITIES':
      return payload;
    case 'TOGGLE_ACTIVE_CITY':
      return state.map(city => {
        city.isActive = city.value === payload.cityId;
        return city;
      });
    default:
      return state;
  }
};
