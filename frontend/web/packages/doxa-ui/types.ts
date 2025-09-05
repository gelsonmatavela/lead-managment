export type ApiDataResponse<T> = {
  data: T;
  total?: number;
  results?: number;
};
