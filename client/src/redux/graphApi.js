import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../api";

export const AccountApi = createApi({
  reducerPath: "accountApi",
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (builder) => ({
    getAccount: builder.query({
      query: () => `accounts`,
    }),
  }),
});

export const { useGetAccountBalance } = AccountApi;
