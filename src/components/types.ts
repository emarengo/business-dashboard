import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { ApiError } from '../data/api';
import { ApiData } from '../data/types';
import { IDateRange } from './shifts/types';

export interface ICity {
  key: string;
  label: string;
  latitude: string | undefined;
  longitude: string | undefined;
  value: string;
  isActive: boolean;
}

export interface ICityOption {
  label?: string;
  value: React.ReactText;
}

export interface IServiceOption {
  label?: string;
  value: React.ReactText;
  key: string;
}

export interface IDriversFilterOption {
  label?: string;
  value: React.ReactText;
  key: string;
}

export type FileData = string | ArrayBuffer | null;

export interface IViewHeader {
  children?: React.ReactNode | null;
  title: string;
}

export interface IHeader {
  city?: ICityOption;
  cityOptions?: ICityOption[];
  services?: IServiceOption[];
  driversFilter?: IDriversFilterOption[];
  onChangeCity?: (selectedCity: ICityOption) => void;
  onChangeService?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeDriverFilterOption?: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  onFileInput?: (fileData: FileData) => Promise<void>;
  onChangeViewMode?: (viewMode: string) => void;
  onChangeDateRange?: (dateRange: IDateRange) => void;
  title?: React.ReactNode;
  errors?: string[];
  mode?: string;
  searchInput?: string;
  onSearchInput?: (event: React.FormEvent<HTMLInputElement>) => void;
  onSearchClear?: () => void;
  onCreateNew?: () => void;
  onSave?: () => void;
  onGoingBack?: (() => void) | null;
  submitText?: string;
  uriBack?: string;
  onHandleKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  currentShifts?: boolean;
}

export interface INotification {
  title: string | null;
  type: string;
  hasCloseButton: boolean;
  isVisible: boolean;
  message?: string | null;
  children?: React.ReactNode | null;
  onClick?: () => void;
  className?: string;
}

export interface ISideNav extends RouteComponentProps {
  home: string;
  isDriverPerformanceServiceEnabled: boolean;
}

export type DataTableItem<T = unknown> = Record<string, T>;

export interface IDataTable<T extends Record<string, unknown>> {
  heading?: string[];
  items: Array<T> | null;
  mapping?: string[];
  currentShifts?: boolean;
  notice?: React.ReactChild;
  isLoading?: boolean;
  onRowClick?: (item: T, index?: number) => void;
  onRenderCell?: (item: T, prop: string, rowIndex?: number) => React.ReactNode;
  onRenderEmpty?: () => React.ReactNode;
  onRenderActions?: (item: T) => React.ReactNode;
}

export interface IDataTableColumn {
  header: string;
  mapping: string;
}

export type FormState<T> = T;

export interface IForm<T> {
  data?: T;
  shouldSubmit: boolean;
  onAfterSubmit: () => void;
  onSubmit: (formState: T) => Promise<ApiData<unknown> | ApiError>;
  onSubmitSuccess: (registered: boolean) => void;
  onSubmitError: (error: ApiError) => void;
  onChange: () => void;
}

export interface IConfirm {
  isVisible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  children?: React.ReactNode;
  title?: string;
}

export interface ISelect {
  options: IOption[];
  defaultValue: string | number;
  dependsOn?: string | number | null;
  name: string;
  value: any;
  onChange: (
    value: IOption,
    passive?: boolean,
    callback?: (state: any) => void
  ) => void;
}

export interface IOption {
  name: string | number;
  value?: string | number;
}

export type ButtonStyles = {
  backgroundColor?: string;
  big?: boolean;
  border?: string;
  contentColor?: string;
  cursor?: string;
  main?: boolean;
};

export interface IButton {
  active?: boolean;
  buttonStyles?: ButtonStyles;
  content?: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}
