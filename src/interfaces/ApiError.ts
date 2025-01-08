export interface IAPIError {
  statusCode: number;
  errorMessage: string;
  timestamp: string;
  path: string;
}
