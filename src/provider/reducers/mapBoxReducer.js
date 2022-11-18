export default (state, { type, payload }) => {
  switch (type) {
    case 'SET_MAP':
      return payload;
    default:
      return state;
  }
};
