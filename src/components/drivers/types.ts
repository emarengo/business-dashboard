/* eslint-disable no-unused-vars */
import React from 'react';

type LatestShiftEvent = {
  label: string;
  is_alert: boolean;
  needs_ack: boolean;
  timestamp: string;
  event_id: string;
};

type ShiftCheckIn = {
  plates?: string;
  registration_time?: string;
  car_assignment_time?: string;
};

export enum ShiftType {
  Scheduled = 'scheduled',
  Buffered = 'buffered'
}

export type IShift = {
  driver_id: number;
  driver_first_name: string;
  driver_last_name: string;
  driver_shift_id: number;
  driver_shift_start: string;
  driver_shift_end: string;
  driver_shift_type?: '' | ShiftType;
  latest_event?: LatestShiftEvent;
  driver_shift_total_unavailable_time?: number;
  driver_shift_checkin?: ShiftCheckIn;
};

export interface IPerformance {
  uriBack: string;
  isCurrent: boolean;
}

export interface IComment {
  author_name: string;
  body: string;
  timestamp: string;
}

export interface ITimelineMouseEvent {
  id: string;
  rideId: string;
  eventId: string;
  title: string;
  comments: IComment[];
  isAcknowledged: boolean;
}

export interface ITimelineEventData {
  id: string;
  label: string;
  ride_id?: number;
  ride_url?: string;
  driver_id: number;
  comments: IComment[];
  reason: string;
  description: string;
  timestamp: string;
  needs_ack: boolean;
  is_alert: boolean;
  rating?: number;
}

export interface ITimelineEvent {
  data: ITimelineEventData;
  isActive: boolean;
  isAcknowledged: boolean | undefined;
  onClick: (element: HTMLElement | null) => void;
}

export type TimelineEventGroup = Record<string, ITimelineEventData[]>;

export interface ITimeline {
  data: TimelineEventGroup;
  playgroundElement?: HTMLElement | null;
  parentElement?: HTMLElement | null;
  hiddenCommentBox?: boolean;
  hasMore: boolean;
  groupKeyScheme: RegExp;
  onLoadMore: () => void;
}

export interface ICommentBox {
  title?: string;
  comments?: IComment[] | null;
  offsetTop: number;
  playground?: HTMLElement | null;
  inputValue: string;
  isVisible: boolean;
  isActive: boolean;
  onInput: (event: React.FormEvent<HTMLInputElement>) => void;
  onClose: () => void;
  onSave?: () => void;
}

export enum RadialProgressStatus {
  Good,
  Bad
}

export interface IKpi {
  caption: string;
  percent: string | number;
  value?: number;
  status: RadialProgressStatus;
  notice?: string;
  measure?: string;
}

export interface IKpiBox {
  data: Array<IKpi>;
}

export interface IRadialProgress {
  status?: RadialProgressStatus;
  percent: string | number;
  value?: string | number | null;
  size?: number;
  measure?: string;
}

export interface ICancellationRate {
  value: number;
  threshold: number;
}

export interface ITimeOffline {
  value: number;
  threshold: number;
}

export interface IRating {
  threshold: number;
  value: number;
  votes: number;
}

export interface IStatistics {
  cancellation_rate: ICancellationRate;
  time_offline: ITimeOffline;
  shift_completion: number;
  rating: IRating;
}

export interface IDetails {
  driver_id: number;
  driver_url: string;
  driver_first_name: string;
  driver_last_name: string;
  avatar_link: string;
  driver_shift_start: string;
  driver_shift_end: string;
  vehicle_plates: string;
  overall_rating: number;
}

export interface IPartnerDetails {
  details: IDetails | null;
  statistics?: IStatistics | null;
}

export enum ShiftStatus {
  Current = 'current',
  Previous = 'last_expired'
}

export enum DriverAvailability {
  NotLogged,
  Available,
  Unavailable
}

export enum Languages {
  English = 'en'
}

export type Translation = {
  [key: string]: string;
};

export type i18n = {
  [lang: string]: Translation;
};

export type Shifts = IShift[] | null;

export type GroupedShift = {
  shift_start: string;
  shift_end: string;
  shifts: Shifts;
};

export type GroupedShifts = GroupedShift[] | null;

export interface IPartnerStatus {
  isActive: boolean;
  dateTime: string;
}

export interface IShiftAccordion {
  children: React.ReactNode;
  shiftEndTime: string;
  shiftStartTime: string;
  shiftTitle: string;
}
