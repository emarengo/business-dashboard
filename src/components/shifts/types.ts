import React from 'react';

export interface IShift {
  driver_shifts: IDriverSchedule[];
  first_name: string;
  last_name: string;
  id_driver: number;
}

export interface IDriverSchedule {
  end_date: string;
  shift_type: string;
  start_date: string;
  vehicle_plates: string;
}

export interface IDateRange {
  start: string;
  end: string;
}

export interface ITimeRange {
  start: number;
  end: number;
}

export interface IInfoIcon {
  children: React.ReactNode;
  token: string;
  isActive: boolean;
  isRead?: boolean;
  onClick: () => void;
  onDismiss: () => void;
}
