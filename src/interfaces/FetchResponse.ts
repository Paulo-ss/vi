import { IAPIError } from "./ApiError";

export interface IFetchResponse<T> {
  data?: T;
  response?: Response;
  error?: IAPIError;
}
