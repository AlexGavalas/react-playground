import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const itemsAPI = createApi({
    reducerPath: 'itemsAPI',
    tagTypes: ['items'],
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/' }),
    endpoints: (builder) => ({
        getAll: builder.query({
            query: () => 'items',
            providesTags: ['items'],
        }),
        updateOne: builder.mutation({
            query(item) {
                return {
                    url: `items/${item.id}`,
                    method: 'PUT',
                    body: item,
                };
            },
            invalidatesTags: ['items'],
        }),
    }),
});
