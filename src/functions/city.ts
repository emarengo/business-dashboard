import { Market, CapitalCityLatLng } from '../constants';

export function getCapitalCityLatLng(): [number, number] {
  // Find current market
  const market = Object.values(Market).find((item) =>
    window.location.host.split('.').includes(item)
  );

  if (market) return CapitalCityLatLng[market];

  // Default capital city geolocation
  return CapitalCityLatLng[Market.Mexico];
}
