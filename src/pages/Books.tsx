import { Link, useNavigate } from "react-router-dom";
import { useGetBooksQuery } from "../features/books/booksApi";
import { useState } from "react";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

import {
  FiBook,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiArrowLeft,
  FiArrowRight,
  FiPlus,
} from "react-icons/fi";
import { FaSpinner } from "react-icons/fa";

const limit = 12;

// type Book = {
//   _id: string;
//   title: string;
//   author: string;
//   genre: string;
//   isbn: string;
//   copies: number;
//   available: boolean;
// };

const Books = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error, refetch } = useGetBooksQuery({
    page,
    limit,
  });

  const allBooks = data?.books || [];

  const navigate = useNavigate();

  function isErrorWithMessage(
    error: unknown
  ): error is FetchBaseQueryError & { data: { message: string } } {
    return (
      typeof error === "object" &&
      error !== null &&
      "data" in error &&
      typeof (error as { data?: unknown }).data === "object" &&
      error.data !== null &&
      "message" in (error as { data: { message?: unknown } }).data
    );
  }
  const navigatePage = (newPage: number) => {
    if (newPage < 1 || (data && data.books.length < limit && newPage > page))
      return;
    setPage(newPage);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-sky-50 to-sky-100">
        <div className="text-center">
          <FaSpinner className="animate-spin text-sky-600 text-4xl mx-auto mb-4" />
          <p className="text-sky-800 text-xl">Loading books...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-sky-100 flex items-center justify-center p-4">
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <div className="text-red-500 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-sky-900 mb-2">
            Error Loading Books
          </h2>
          <p className="text-sky-800 mb-6">
            {isErrorWithMessage(error)
              ? error.data.message
              : "Something went wrong."}
          </p>
          <button
            onClick={refetch}
            className="px-6 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors shadow-md hover:shadow-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 w-full px-4 py-8 sm:px-6 md:px-10 max-w-screen-xl mx-auto mt-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-sky-900 flex items-center">
          <FiBook className="mr-2" /> Library Catalog
        </h1>
        <Link
          to="/create-book"
          className="flex items-center px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          <FiPlus className="mr-2" /> Add New Book
        </Link>
      </div>

      {allBooks.length === 0 ? (
        <div className="text-center text-sky-800 text-lg">No books found.</div>
      ) : (
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {allBooks.map((book) => (
            <div
              key={book._id}
              className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl border hover:shadow-cyan-800 border-sky-100 hover:bg-sky-200 hover:border-sky-500 transform hover:-translate-y-1 transition-all duration-300"
            >
              <div className="p-4 sm:p-5">
                <h3 className="text-base sm:text-lg font-semibold text-sky-900 mb-2 line-clamp-2">
                  {book.title}
                </h3>
                <p className="text-xs sm:text-sm text-sky-800 mb-1">
                  <span className="font-medium">Author:</span> {book.author}
                </p>
                <p className="text-xs sm:text-sm text-sky-800 mb-1">
                  <span className="font-medium">Genre:</span> {book.genre}
                </p>
                <p className="text-xs sm:text-sm text-sky-800 mb-1">
                  <span className="font-medium">ISBN:</span> {book.isbn}
                </p>
                <p className="text-xs sm:text-sm text-sky-800 mb-3">
                  <span className="font-medium">Copies:</span> {book.copies}
                </p>

                <div
                  className={`inline-block px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs font-medium mb-3 ${
                    book.available
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-red-400 text-gray-800"
                  }`}
                >
                  {book.available ? "Available" : "Unavailable"}
                </div>
              </div>

              <div className="px-4 sm:px-5 pb-4 sm:pb-5 flex flex-wrap gap-2">
                <Link
                  to={`/books/${book._id}`}
                  className="flex items-center px-2 py-1 sm:px-3 sm:py-1.5 bg-sky-100 text-sky-600 rounded-md hover:bg-sky-200 transition-colors text-xs sm:text-sm hover:shadow-sm"
                >
                  <FiEye className="mr-1 sm:mr-1.5" /> View
                </Link>
                <Link
                  to={`/edit-book/${book._id}`}
                  className="flex items-center px-2 py-1 sm:px-3 sm:py-1.5 bg-amber-100 text-amber-600 rounded-md hover:bg-amber-200 transition-colors text-xs sm:text-sm hover:shadow-sm"
                >
                  <FiEdit2 className="mr-1 sm:mr-1.5" /> Edit
                </Link>
                <button
                  onClick={() => navigate(`/delete-book/${book._id}`)}
                  className="flex items-center px-2 py-1 sm:px-3 sm:py-1.5 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors text-xs sm:text-sm hover:shadow-sm"
                >
                  <FiTrash2 className="mr-1 sm:mr-1.5" /> Delete
                </button>
                <Link
                  to={`/borrow/${book._id}`}
                  onClick={(e) => !book.available && e.preventDefault()}
                  className={`flex items-center px-2 py-1 sm:px-3 sm:py-1.5 rounded-md transition-colors text-xs sm:text-sm hover:shadow-sm ${
                    book.available
                      ? "bg-emerald-100 text-emerald-600 hover:bg-emerald-200"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-1.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                    />
                  </svg>
                  Borrow
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-sky-50 rounded-lg px-4 py-4 border border-sky-200 mt-6 gap-4 sm:gap-0">
        <button
          onClick={() => navigatePage(page - 1)}
          disabled={page === 1}
          className={`flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition-colors w-full sm:w-auto justify-center ${
            page === 1
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-sky-600 text-white hover:bg-sky-700 hover:shadow-md transform hover:-translate-y-0.5"
          }`}
        >
          <FiArrowLeft className="mr-2" /> Previous
        </button>
        <span className="text-sky-800 font-medium text-sm sm:text-base">
          Page {page}
        </span>
        <button
          onClick={() => navigatePage(page + 1)}
          disabled={page >= (data?.totalPages ?? Infinity)}
          className={`flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition-colors w-full sm:w-auto justify-center ${
            page >= (data?.totalPages ?? Infinity)
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-sky-600 text-white hover:bg-sky-700 hover:shadow-md transform hover:-translate-y-0.5"
          }`}
        >
          Next <FiArrowRight className="ml-2" />
        </button>
      </div>
    </div>
  );
};

export default Books;
