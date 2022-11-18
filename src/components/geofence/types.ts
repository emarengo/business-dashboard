import { FeatureCollection } from 'geojson';

export interface IPartnerAreas {
  geo: FeatureCollection;
  id: string;
}

export interface ICityArea {
  created_at: string;
  eta: number;
  etrc: number;
  eyeballs: number;
  eyeballs_as_pct_of_city: number;
  id: number;
  pickup_rate: number;
  pickup_time: number;
}

export interface ICityAreaDetails {
  city_area_id: number;
  data: ICityArea;
}
