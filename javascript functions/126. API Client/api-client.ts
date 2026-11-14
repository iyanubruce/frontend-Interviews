export type HeadersMap = Record<string, string>;

export type APIRequestBuilder = {
  setHeaders(headers: HeadersMap): APIRequestBuilder;
  get(): Promise<Response>;
  post(body?: BodyInit): Promise<Response>;
};

export default function createAPI(baseURL: string): {
  url(path: string): APIRequestBuilder;
} {
  throw new Error("Not implemented!");
}
