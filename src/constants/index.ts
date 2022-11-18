export const Surge = {
  color: {
    300: '#E00000',
    150: '#FF2700',
    100: '#EE5A23',
    75: '#F38258',
    50: '#F4A171',
    25: '#FFCB77',
    0: '#000000'
  },
  range: [0, 25, 50, 75, 100, 150, 300]
};

export enum CitySettings {
  CountryId = 'id_ot_country',
  OfflineReasonEnabled = 'partner_offline_reason_enabled'
}

export enum Market {
  Argentina = 'argentina',
  Chile = 'chile',
  Colombia = 'colombia',
  Mexico = 'mexico',
  Peru = 'peru'
}

export const CapitalCityLatLng = {
  [Market.Argentina]: [-58.4379, -34.5997],
  [Market.Chile]: [-70.6623, -33.43],
  [Market.Colombia]: [-74.0855, 4.6626],
  [Market.Mexico]: [-99.133209, 19.432608],
  [Market.Peru]: [-77.0333, -12.05]
} as { [K in Market]: [number, number] };
