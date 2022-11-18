export interface IOfflineReasons {
  id: number;
  id_city: number;
  code: string;
  active: boolean;
  description: string;
  description_en: string;
  icon: string;
  name: string;
  name_en: string;
  rank: number;
}

export interface IDriverPerformanceStatus {
  city_id: number;
  enabled: boolean;
}

export type Settings = { isDriverPerformanceServiceEnabled: boolean };
