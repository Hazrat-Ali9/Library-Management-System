import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { booksApi } from '../books/booksApi'; 

interface BorrowSummaryItem {
  book: {
    _id: string;
    title: string;
    isbn: string;
  };
  totalQuantity: number;
}


interface BorrowSummaryResponse {
  success: boolean;
  data: BorrowSummaryItem[];
}

export const borrowApi = createApi({
  reducerPath: 'borrowApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://library-management-ten-beta.vercel.app',
  }),
  tagTypes: ['Borrow', 'Books'],
  endpoints: (builder) => ({
    
    borrowBook: builder.mutation<
  void,
  { book: string; quantity: number; dueDate: string }
>({
  query: (body) => ({
    url: '/api/borrow',
    method: 'POST',
    body,
  }),
   invalidatesTags: ['Borrow'],

  async onQueryStarted({ book, quantity }, { dispatch, queryFulfilled, getState }) {
    const patchBook = dispatch(
      booksApi.util.updateQueryData('getBook', book, (draft) => {
        draft.copies -= quantity;
        draft.available = draft.copies > 0;
      })
    );

    const booksApiState = ((getState() as unknown) as {
      booksApi?: { queries?: Record<string, unknown> }
    }).booksApi;
    
    const queries = Object.entries(booksApiState?.queries ?? {});
    const patchBooks: Array<{ undo: () => void }> = [];

    for (const [key] of queries) {
      if (key.startsWith("getBooks")) {
        const match = key.match(/getBooks\((.*)\)/);
        const args = match?.[1] ? JSON.parse(match[1]) : {};

        const patch = dispatch(
          booksApi.util.updateQueryData('getBooks', args, (booksData) => {
            const bookToUpdate = booksData.books.find((b) => b._id === book);
            if (bookToUpdate) {
              bookToUpdate.copies -= quantity;
              bookToUpdate.available = bookToUpdate.copies > 0;
            }
          })
        );

        patchBooks.push(patch);
      }
    }

    try {
      await queryFulfilled;
    } catch {
      patchBook.undo();
      patchBooks.forEach((patch) => patch.undo());
    }
  },
}),

   
    getBorrowSummary: builder.query<BorrowSummaryItem[], void>({
      query: () => '/api/borrow',
      transformResponse: (response: BorrowSummaryResponse) => response.data,
      providesTags: ['Borrow'],
    }),
  }),
});

export const {
  useBorrowBookMutation,
  useGetBorrowSummaryQuery,
} = borrowApi;
