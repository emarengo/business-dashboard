import citiesReducer from '../citiesReducer';
const cities = [
  {
    key: '1',
    value: '1',
    label: 'Lima',
    isActive: true
  },
  {
    key: '2',
    value: '2',
    label: 'Cusco',
    isActive: false
  },
  {
    key: '3',
    value: '3',
    label: 'Cusco3',
    isActive: false
  }
];
describe('citiesReducer', () => {
  test('should return the initial state', () => {
    expect(citiesReducer([], {})).toEqual([]);
  });

  test('should set cities', () => {
    expect(
      citiesReducer([], {
        type: 'SET_CITIES',
        payload: cities
      })
    ).toEqual([...cities]);
  });

  test('should toggle active city in cities', () => {
    const citiesUpdated = [
      {
        key: '1',
        value: '1',
        label: 'Lima',
        isActive: false
      },
      {
        key: '2',
        value: '2',
        label: 'Cusco',
        isActive: false
      },
      {
        key: '3',
        value: '3',
        label: 'Cusco3',
        isActive: true
      }
    ];
    expect(
      citiesReducer([...cities], {
        type: 'TOGGLE_ACTIVE_CITY',
        payload: { cityId: '3' }
      })
    ).toEqual(citiesUpdated);
  });
});
