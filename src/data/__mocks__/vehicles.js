export const list = [
  {
    id: 12341,
    plates: 'AAZ 1029',
    brand: 'Tesla',
    model: 'Model 1',
    year: 2017,
    vin: '12345678',
    contact_number: '00306976618861',
    parking_lot: 'PL Av. Cuauhtémoc'
  },
  {
    id: 12342,
    plates: 'ANA 1404',
    brand: 'Toyota',
    model: 'Yaris',
    year: 2017,
    vin: '12345678',
    contact_number: '00306976618861',
    parking_lot: 'PL Av. Cuauhtémoc'
  },
  {
    id: 12343,
    plates: 'NAA 7890',
    brand: 'Peugeot',
    model: 'Model 3',
    year: 2017,
    vin: '12345678',
    contact_number: '00306976618861',
    parking_lot: 'PL Av. Cuauhtémoc'
  },
  {
    id: 12344,
    plates: 'NAB 8888',
    brand: 'Tesla',
    model: 'Model 2',
    year: 2017,
    vin: '12345678',
    contact_number: '00306976618861',
    parking_lot: 'PL Av. Cuauhtémoc'
  },
  {
    id: 12345,
    plates: 'NAA 1024',
    brand: 'Tesla',
    model: 'Model 3',
    year: 2017,
    vin: '12345678',
    contact_number: '00306976618861',
    parking_lot: 'PL Av. Cuauhtémoc'
  },
  {
    id: 12346,
    plates: 'YAZ 2020',
    brand: 'Citroen',
    model: 'C5',
    year: 2017,
    vin: '12345678',
    contact_number: '00306976618861',
    parking_lot: 'PL Av. Cuauhtémoc'
  },
  {
    id: 12346,
    plates: 'YAZ 2020',
    brand: 'Tesla',
    model: 'Model 3',
    year: 2017,
    vin: '12345678',
    contact_number: '00306976618861',
    parking_lot: 'PL Av. Cuauhtémoc'
  }
];

export const cities = [
  {
    label: 'Mexico City',
    value: 'Mexico City'
  }
];

export const modelOptions = [
  'Model 1',
  'Model 2',
  'Model 3',
  'Model 4',
  'Model 5',
  'Model 6'
];

export const brandOptions = [
  'Tesla',
  'Toyota',
  'Peugeot',
  'BMW',
  'Volvo',
  'Audi',
  'Citroen'
];

export const yearOptions = Array.from({ length: 20 }).map((_, i) => 2020 - i);

export const parkingLotOptions = [
  'PL Av. Rio Consulado',
  'PL Pensador Mexicano',
  'PL Av. Cuauhtémoc',
  'PL Bosque de Chapultepec',
  'PL Av. Pueblo de San Juan de Aragón'
];
