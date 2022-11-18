/* eslint-disable @typescript-eslint/no-shadow */
import React from 'react';
import 'fetch-xhr';
import { Feature, FeatureCollection } from 'geojson';
import rewind from '@mapbox/geojson-rewind';
import qs from 'qs';
import env from './environment';
import { getCookie } from '../functions';
import { ApiData, RequestData, ServerError } from './types';
import { IVehicle, IVehicleDataItem } from '../components/vehicles/types';
import {
  IComment,
  IDetails,
  IStatistics,
  ITimelineEventData,
  Shifts,
  ShiftStatus
} from '../components/drivers/types';
import { ICity } from '../components/types';
import { IShift } from '../components/shifts/types';
import {
  IDriverPerformanceStatus,
  IOfflineReasons
} from '../components/settings/types';
import { IDriverNotification } from '../components/notifications/types';
import { ICityAreaDetails, IPartnerAreas } from '../components/geofence/types';
import { IHistoryVersion } from '../components/history/types';

export class ApiError extends Error {
  logs: ServerError[] = [];
  statusCode = NaN;

  getLogMessages(): Array<string> {
    return this.logs.map((lg) => lg.message);
  }
}

function endpoint(url: string, queryParams: Record<string, string>): string {
  return Object.keys(queryParams).length === 0
    ? `${env.api.host}/api/${env.api.version}${url}`
    : `${env.api.host}/api/${env.api.version}${url}?${qs.stringify(
        queryParams
      )}`;
}

function checkStatus(response: Response): Promise<Response> {
  if (response.status > 300 && response.status < 400) {
    // Re-initiate the expired auth session
    window.location.reload();
  }

  if (response.status >= 400 && response.status <= 500) {
    return Promise.reject(response);
  }

  return Promise.resolve(response);
}

async function unpack<T>(response: Response): Promise<ApiData<T>> {
  try {
    const json = await (response as Response).json();
    // Valid JSON response
    return Promise.resolve(json);
  } catch (e) {
    // Empty response body
    return Promise.resolve(Object.create(null));
  }
}

async function error(response: Response | Error): Promise<ApiError> {
  if (response instanceof Error) {
    const apiError = new ApiError();
    apiError.message = `'${response.message}'`;
    return apiError;
  }

  return response
    .json()
    .then((body: { errors: Array<ServerError | string> } | ServerError) => {
      const apiError = new ApiError();
      apiError.name = `Server error (${response.status})`;

      function isServerErrorArray(data: unknown): data is ServerError[] {
        return (
          Array.isArray(data) &&
          typeof data[0] === 'object' &&
          'name' in data[0] &&
          'message' in data[0]
        );
      }

      function isStringArray(data: unknown): data is string[] {
        return Array.isArray(data) && typeof data[0] === 'string';
      }

      if ('errors' in body) {
        if (isServerErrorArray(body.errors)) {
          apiError.message = body.errors[0].message;
          apiError.logs = body.errors;
        } else if (isStringArray(body.errors)) {
          apiError.message = response.statusText;
          apiError.logs = body.errors.map((message) => ({
            name: '',
            message
          }));
        }
      } else {
        apiError.name = body.code || `Server error (${response.status})`;
        apiError.message = body.message || response.statusText;
      }

      apiError.statusCode = response.status;

      return apiError;
    });
}

async function fetchData<T>(
  url: string,
  urlParameters: Record<string, string> = {},
  requestData?: RequestData
): Promise<ApiData<T> | ApiError> {
  const authHeaders = new Headers({
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: getCookie() || '',
    ...requestData?.headers
  });
  const request = new Request(endpoint(url, urlParameters), {
    headers: authHeaders,
    method: requestData?.method,
    body: requestData?.body
  });

  return fetch(request)
    .then(checkStatus)
    .then((response) => unpack<T>(response))
    .catch(error);
}

export function handleApiResponse<T>(
  response: ApiData<T> | ApiError,
  onSuccess: (data: ApiData<T>) => void,
  onError?: (error: ApiError) => void,
  onFinish?: () => void
): void {
  if (response instanceof Error) {
    if (typeof onError === 'function') onError(response);
  } else {
    onSuccess(response);
  }

  if (typeof onFinish === 'function') onFinish();
}

const api = {
  getCities(): Promise<ApiData<ICity[]> | ApiError> {
    return fetchData(`/cities`);
  },

  getCityById(cityId: string): Promise<ApiData<ICity> | ApiError> {
    return fetchData(`/cities/${cityId}`);
  },

  getShiftsByCity(
    cityId: React.ReactText,
    startDate: string,
    endDate: string
  ): Promise<ApiData<{ shifts: IShift[] }> | ApiError> {
    return fetchData(`/shifts/${cityId}`, {
      from: startDate,
      to: endDate
    });
  },

  getShifts(
    status: string,
    driverID?: string,
    driverName?: string,
    serviceID?: number,
    driverFilterOption?: string
  ): Promise<ApiData<{ data: Shifts }> | ApiError> {
    let urlParameters = {};

    if (serviceID) {
      urlParameters = {
        ...urlParameters,
        ...{ serviceID }
      };
    }
    if (driverID) {
      urlParameters = {
        ...urlParameters,
        ...{ driverID }
      };
    }
    if (driverName) {
      urlParameters = {
        ...urlParameters,
        ...{ driverName }
      };
    }
    if (driverFilterOption) {
      urlParameters = {
        ...urlParameters,
        ...{ driverFilterOption }
      };
    }
    if (status === ShiftStatus.Current) {
      urlParameters = {
        ...urlParameters,
        ...{ groupBy: 'time' }
      };

      return fetchData('/shifts-grouped', urlParameters);
    }

    urlParameters = { ...urlParameters, ...{ shiftsStatus: status } };

    return fetchData(`/drivers/shifts`, urlParameters);
  },

  getShiftEvents(
    shiftId: string,
    beforeTimestamp?: string,
    limit = 5
  ): Promise<ApiData<{ data: ITimelineEventData[] }> | ApiError> {
    const urlParameters: Record<string, string> = { limit: limit.toString() };

    if (beforeTimestamp) {
      // eslint-disable-next-line dot-notation
      urlParameters['events_before_timestamp'] = beforeTimestamp;
    }

    return fetchData(`/drivers/shifts/${shiftId}/timeline`, urlParameters);
  },

  acknowledgeShiftEvent(
    shiftId: number,
    eventId: string,
    shouldBeAcknowledged = false
  ): Promise<ApiData<unknown> | ApiError> {
    return fetchData(
      `/drivers/shifts/${shiftId}/events/${eventId}/acknowledgement`,
      {},
      {
        method: 'PATCH',
        body: JSON.stringify({ needs_ack: shouldBeAcknowledged || false })
      }
    );
  },

  getNotifications(
    beforeTimestamp: string | undefined = undefined,
    limit = 10
  ): Promise<ApiData<{ data: IDriverNotification[] }> | ApiError> {
    let urlParameters: Record<string, string> = { limit: limit.toString() };

    if (beforeTimestamp) {
      urlParameters = {
        ...urlParameters,
        ...{ events_before_timestamp: beforeTimestamp }
      };
    }

    return fetchData(`/drivers/notifications`, urlParameters);
  },

  getDriverDetails(
    shiftId: string
  ): Promise<
    ApiData<{ data: { statistics: IStatistics } & IDetails }> | ApiError
  > {
    return fetchData(`/drivers/shifts/${shiftId}/statistics`);
  },

  getAllVehicles(
    cityId: React.ReactText
  ): Promise<ApiData<{ vehicles: IVehicle[] }> | ApiError> {
    return fetchData(`/vehicles/city/${cityId}`);
  },

  getVehicle(
    vehicleId: string
  ): Promise<ApiData<{ vehicle: IVehicle }> | ApiError> {
    return fetchData(`/vehicle/${vehicleId}`);
  },

  getVehicleBrands(): Promise<
    ApiData<{ vehicle_brands: IVehicleDataItem[] }> | ApiError
  > {
    return fetchData(`/vehicles/brands`);
  },

  getVehicleModels(
    brandId: string | number
  ): Promise<ApiData<{ vehicle_models: IVehicleDataItem[] }> | ApiError> {
    return fetchData(`/vehicles/brands/${brandId}/models`);
  },

  getVehicleColors(): Promise<
    ApiData<{ vehicle_colors: IVehicleDataItem[] }> | ApiError
  > {
    return fetchData(`/vehicles/colors`);
  },

  getParkingLots(
    cityId: string | number
  ): Promise<ApiData<{ parking_lots: IVehicleDataItem[] }> | ApiError> {
    return fetchData(`/parking-lots/${cityId}`);
  },

  updateVehicle(
    vehicle: IVehicle
  ): Promise<ApiData<{ vehicle: IVehicle }> | ApiError> {
    const { id_vehicle: vehicleId, ...data } = vehicle;

    return fetchData(
      `/vehicle/${vehicleId}`,
      {},
      {
        body: JSON.stringify(data),
        method: 'PUT'
      }
    );
  },

  createVehicle(
    vehicle: IVehicle
  ): Promise<ApiData<{ vehicle: IVehicle }> | ApiError> {
    return fetchData(
      `/vehicles`,
      {},
      {
        body: JSON.stringify(vehicle),
        method: 'POST'
      }
    );
  },

  getOfflineReasons(
    cityId: string
  ): Promise<ApiData<IOfflineReasons[]> | ApiError> {
    return fetchData(`/settings/cities/${cityId}/offline-reasons`);
  },

  postShifts(
    cityId: React.ReactText,
    csvFileContent: string | ArrayBuffer | null
  ): Promise<ApiData | ApiError> {
    return fetchData(
      `/shifts/${cityId}`,
      {},
      {
        headers: {
          'Content-Type': 'text/csv'
        },
        body: csvFileContent,
        method: 'PUT'
      }
    );
  },

  postComment(
    shiftId: string,
    eventId: string,
    comment: string
  ): Promise<ApiData<{ data: IComment }> | ApiError> {
    const requestBody = {
      body: comment,
      author_name: env.userName,
      author_email: env.userEmail
    };
    return fetchData(
      `/drivers/shifts/${shiftId}/events/${eventId}/comments`,
      {},
      {
        body: JSON.stringify(requestBody),
        method: 'POST'
      }
    );
  },

  setOfflineReasons(
    cityId: string,
    reasons: string[]
  ): Promise<
    ApiData<{ result: { offline_reasons: IOfflineReasons[] } }> | ApiError
  > {
    return fetchData(
      `/settings/cities/${cityId}/offline-reasons`,
      {},
      {
        body: JSON.stringify({ offline_reasons: reasons }),
        method: 'PUT'
      }
    );
  },

  setSettingsByCityId(
    cityId: string,
    settings: Record<string, unknown> | null
  ): Promise<ApiData<unknown> | ApiError> {
    return fetchData(
      `/settings/cities/${cityId}`,
      {},
      {
        method: 'PUT',
        body: JSON.stringify(settings)
      }
    );
  },

  getDriverPerformanceServiceStatus(
    cityId: string
  ): Promise<ApiData<{ data: IDriverPerformanceStatus }> | ApiError> {
    return fetchData(`/cities/${cityId}/status`);
  },

  setDriverPerformanceServiceStatus(
    cityId: string,
    shouldEnable: boolean
  ): Promise<ApiData<{ data: IDriverPerformanceStatus }> | ApiError> {
    return fetchData(
      `/settings/cities/${cityId}/status/${shouldEnable ? 'on' : 'off'}`,
      {},
      {
        method: 'POST'
      }
    );
  },

  getPartnerAreas(cityId: string): Promise<ApiData<IPartnerAreas> | ApiError> {
    return fetchData(`/geofence/cities/${cityId}/areas`);
  },

  cityAreas(): Promise<ApiData<FeatureCollection> | ApiError> {
    return fetchData(`/geofence/areas`);
  },

  updateGeojson(
    geojson: FeatureCollection,
    cityId: string,
    areaId: string,
    hasTransformations: boolean
  ): Promise<ApiData<{ id: string }> | ApiError> {
    rewind(geojson, false);
    // @TODO remove this when city_ids property in BE is an array of integers
    if (hasTransformations) {
      geojson.features.forEach((feature: Feature) => {
        if (
          feature.properties?.city_area_ids &&
          feature.geometry.type === 'Polygon'
        ) {
          // eslint-disable-next-line no-param-reassign
          feature.properties.city_area_ids = `${feature.properties.city_area_ids.map(
            (id: number) => id
          )}`;
        }
      });
    }
    return fetchData(
      `/geofence/cities/${cityId}/areas/${areaId}`,
      {},
      {
        method: 'PUT',
        body: JSON.stringify({ geo: geojson })
      }
    );
  },

  createGeojson(
    geojson: FeatureCollection,
    cityId: string
  ): Promise<ApiData<IPartnerAreas> | ApiError> {
    rewind(geojson, false);
    // @TODO remove this when city_ids property in BE is an array of integers
    geojson.features.forEach((feature: Feature) => {
      if (
        feature.properties?.city_area_ids &&
        feature.geometry.type === 'Polygon'
      ) {
        // eslint-disable-next-line no-param-reassign
        feature.properties.city_area_ids = `${feature.properties.city_area_ids.map(
          (id: number) => id
        )}`;
      }
    });

    return fetchData(
      `/geofence/cities/${cityId}/areas`,
      {},
      {
        method: 'PUT',
        body: JSON.stringify({ geo: geojson })
      }
    );
  },

  historyVersions(
    areaId: string
  ): Promise<ApiData<IHistoryVersion[]> | ApiError> {
    return fetchData(`/geofence/areas/${areaId}/history`);
  },

  getVersionPartnersArea(
    areaId: string
  ): Promise<ApiData<IPartnerAreas> | ApiError> {
    return fetchData(`/geofence/areas/${areaId}`);
  },

  cityAreasDetails(): Promise<ApiData<ICityAreaDetails[]> | ApiError> {
    return fetchData(`/geofence/areas-details`);
  },

  cityAreasFilters(): Promise<ApiData<Array<{ name: string }>> | ApiError> {
    return fetchData(`/geofence/filters`);
  },

  deleteGeofenceArea(
    cityId: string,
    areaId: string
  ): Promise<ApiData<unknown> | ApiError> {
    return fetchData(
      `/geofence/cities/${cityId}/areas/${areaId}`,
      {},
      {
        method: 'DELETE'
      }
    );
  }
};

export default api;
