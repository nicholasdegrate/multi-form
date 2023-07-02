import { createBrowserRouter } from "react-router-dom";
import { App } from "./App";

import qs from "query-string";

export function parseFormData(formOrData: HTMLFormElement | FormData) {
  const data =
    formOrData instanceof HTMLFormElement
      ? new FormData(formOrData)
      : formOrData;

  // We're overriding the type here because the FormData class implements
  // enough methods such that it can be used in URLSearchParams constructor.
  // However, the URLSearchParams constructor doesn't explicitly accept FormData.
  // The constructor can take a URLSearchParams instance and URLSearchParams is
  // the closest approximation for FormData of the allowable inputs to
  // the URLSearchParams constructor.
  const converted = data as unknown as URLSearchParams;
  const params = new URLSearchParams(converted);

  // We're overriding the type here because the parsed
  // value won't be anything other than a Record. The qs library
  // supports other use cases where it can return other data types,
  // but since we know we are parsing a form, we can safely assert this type.
  return qs.parse(params.toString()) as Record<string, any>;
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    action: async ({ request }) => {
      const data = parseFormData(await request.formData());

      console.log({ data });
      return null;
    },
  },
]);
