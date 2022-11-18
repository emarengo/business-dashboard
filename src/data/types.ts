type ApiDataObject<T> = Record<
  T extends string ? string : keyof T,
  T extends string ? string : T[keyof T]
>;

export interface RequestData {
  body?: BodyInit | null;
  headers?: HeadersInit | null;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
}

export type ApiData<T = string> = Array<ApiDataObject<T>> | ApiDataObject<T>;

export type ServerError = {
  name: string;
  message: string;
  code?: string;
};
