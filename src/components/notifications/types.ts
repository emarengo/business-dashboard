export interface IDriverNotification {
  driver_last_name: string;
  driver_name: string;
  driver_shift_id: number;
  is_alert: boolean;
  needs_ack: boolean;
  timestamp: string;
  label: string;
  vehicle_plates: string;
}
