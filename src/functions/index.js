import OfflineReason from '../components/settings/OfflineReason';

export * from './city';
export * from './date';

export function displayError(error, onConsole = false) {
  if (onConsole) {
    console.error(error);
  } else {
    alert(error);
  }
}

export function mapMarkers(markers) {
  return markers.map(function (marker) {
    return {
      id: `driver-marker-${marker.driver_id}`,
      lat: marker.position.lat,
      lng: marker.position.lng,
      onClick: () => console.log('Clicked on marker'),
      style: {
        icon: {
          url: 'https://beat-general.s3.amazonaws.com/beat-react-map/beigeBeat.png',
          size: [60, 60]
        }
      }
    };
  });
}

export function mapCityOptions(cities) {
  return cities instanceof Array
    ? cities.map(({ id_city, name, latitude, longitude, is_capital }) => ({
        key: id_city.toString(),
        value: id_city.toString(),
        isActive: is_capital,
        label: name,
        latitude,
        longitude
      }))
    : [];
}

export function mapToVehicle(data) {
  return {
    id_vehicle: data?.id_vehicle,
    id_city: data?.id_city,
    id_brand: data?.brand?.id,
    id_model: data?.model?.id,
    id_color: data?.id_color,
    id_parking_lot: data?.parking_lot?.id,
    brand: data?.brand?.name || '',
    color: '',
    contact_phone_number: data?.contact_phone_number,
    id_device: data?.id_device,
    model: data?.model?.name || '',
    model_year: data?.model_year || '',
    parking_lot: data?.parking_lot?.title || '',
    plate_no: data?.plate_no || '',
    vin: data?.vin || ''
  };
}

export function getActiveCity(cityOptions) {
  return Object.values(cityOptions).find((i) => i.isActive);
}

function isEmptyObject(o) {
  return Object.keys(o).length === 0;
}

export function getDefaultCity(cityOptions) {
  return cityOptions.reduce(
    (acc, cur) =>
      !isEmptyObject(acc) && parseInt(acc.value) < parseInt(cur.value)
        ? acc
        : cur,
    {}
  );
}

export function getActiveCityId(cities) {
  const city = cities.find((x) => x.isActive);

  return city && city.value ? city.value : null;
}

export function mapOfflineReasons(model) {
  return model.map(
    (item) =>
      new OfflineReason(item.rank, {
        ...item,
        code: item.code,
        id: parseInt(item.id),
        saved: true
      })
  );
}

export const getCookie = (name = 'jwt') => {
  // Split cookie
  const cookies = document.cookie.split(';');

  // Loop through the array elements
  // eslint-disable-next-line
  for (let i = 0; i < cookies.length; i++) {
    const cookiePair = cookies[i].split('=');

    /* Removing whitespace at the beginning of the cookie name
        and compare it with the given string */
    if (name === cookiePair[0].trim()) {
      // Decode the cookie value and return
      return decodeURIComponent(cookiePair[1].replace(/\+/g, '%20'));
    }
  }

  // Return null if not found
  return null;
};

export const parseJwt = (token) => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map((char) => `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`)
      .join('')
  );

  return JSON.parse(jsonPayload);
};

export const getUserProp = (prop) => {
  const token = getCookie();

  if (token) {
    const data = parseJwt(token.replace('Bearer ', ''));
    return data[prop];
  }

  return null;
};
