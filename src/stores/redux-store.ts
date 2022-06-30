import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface Item {
    id: number;
    author: string;
    title: string;
}

export const itemsAPI = createApi({
    reducerPath: 'itemsAPI',
    tagTypes: ['items'],
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/' }),
    endpoints: (builder) => ({
        getAll: builder.query<Item[], unknown>({
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
