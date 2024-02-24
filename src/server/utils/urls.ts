import queryString from 'query-string';

interface UrlWithParameters {
  url: string;
  parameters: Record<string, string>;
}

export const urlWithParameters = ({ url, parameters }: UrlWithParameters) => {
  return `${url}?${queryString.stringify(parameters)}`;
};
