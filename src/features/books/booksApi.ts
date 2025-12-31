// features/books/booksApi.ts
//baseUrl: 'https://library-management-ten-beta.vercel.app',

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Book {
  _id: string;
  title: string;
  author: string;
  genre: string;
  isbn: string;
  description: string;
  copies: number;
  available: boolean;
}

interface BooksResponse {
  success: boolean;
  data: Book[];
}

interface BooksResponse {
  success: boolean;
  data: Book[];
  totalPages: number;
  currentPage: number;
}
interface BookResponse {
  success: boolean;
  data: Book;
}

interface GenreCount {
  _id: string; // genre
  count: number;
}

interface GenreCountResponse {
  success: boolean;
  data: GenreCount[];
}


export const booksApi = createApi({
  reducerPath: 'booksApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://library-management-ten-beta.vercel.app',
  }),
  tagTypes: ['Books'],
  endpoints: (builder) => ({

    getBooks: builder.query<
      { books: Book[]; totalPages: number; currentPage: number },
      { page?: number; limit?: number; filter?: string }
    >({
      query: ({ page = 1, limit = 12, filter } = {}) => {
        let queryString = `/api/books?page=${page}&limit=${limit}`;
        if (filter) {
          queryString += `&filter=${encodeURIComponent(filter)}`;
        }
        return queryString;
      },
      transformResponse: (response: BooksResponse) => ({
        books: response.data,
        totalPages: response.totalPages,
        currentPage: response.currentPage,
      }),
    }),


    getBook: builder.query<Book, string>({
      query: (id) => `/api/books/${id}`,
      transformResponse: (response: BookResponse) => response.data,
      providesTags: (_result, _error, id) => [{ type: 'Books', id }],
    }),

    addBook: builder.mutation<Book, Partial<Book>>({
      query: (book) => ({
        url: '/api/books',
        method: 'POST',
        body: book,
      }),
      transformResponse: (response: BookResponse) => response.data,
      invalidatesTags: ['Books'],
    }),

    updateBook: builder.mutation<Book, { id: string; book: Partial<Book> }>({
      query: ({ id, book }) => ({
        url: `/api/books/${id}`,
        method: 'PUT',
        body: book,
      }),
      transformResponse: (response: BookResponse) => response.data,
      invalidatesTags: ['Books'],
    }),

    deleteBook: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/books/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Books'],
    }),


    getCategoryCounts: builder.query<GenreCount[], void>({
      query: () => `/api/books/category-count`,
      transformResponse: (response: GenreCountResponse) => response.data,
    }),


  }),
});

export const {
  useGetBooksQuery,
  useGetBookQuery,
  useAddBookMutation,
  useUpdateBookMutation,
  useDeleteBookMutation,
  useGetCategoryCountsQuery,
} = booksApi;