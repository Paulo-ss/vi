import { IAPIError } from "@/interfaces/ApiError";
import { IFetchResponse } from "@/interfaces/FetchResponse";

interface IFetchOptions {
  url: string;
  options?: RequestInit;
  ignoreBaseUrl?: boolean;
}

export const fetchResource = async <T>({
  url,
  options,
  ignoreBaseUrl,
}: IFetchOptions): Promise<IFetchResponse<T>> => {
  const requestOptions: RequestInit = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  };

  const response = await fetch(
    `${ignoreBaseUrl ? url : process.env.NEXT_PUBLIC_API_BASE_URL}${url}`,
    requestOptions
  );

  if (!response.ok) {
    const error = (await response.json()) as IAPIError;

    return { error, response };
  }

  const data = await response.json();

  return { data: data as T, response };
};
