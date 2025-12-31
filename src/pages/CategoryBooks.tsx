import { useParams, Link } from "react-router-dom";
import { useGetBooksQuery } from "../features/books/booksApi";
import { FiBookOpen } from "react-icons/fi";
import { FaSpinner } from "react-icons/fa";

const CategoryBooks = () => {
  const { genre } = useParams(); 
  const {
    data,
    isLoading,
    isError,
  } = useGetBooksQuery({ page: 1, limit: 20, filter: genre });
    const allBooks = data?.books || [];

  return (
    <div className="container mx-auto py-10 px-4 mt-16">
      <h2 className="text-3xl font-bold text-sky-800 mb-6 capitalize">
        📚 {genre?.replace("_", " ")} Books
      </h2>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <FaSpinner className="animate-spin text-4xl text-sky-600" />
        </div>
      ) : isError ? (
        <p className="text-red-500 text-center">Failed to load books.</p>
      ) : !allBooks || allBooks.length === 0 ? (
        <p className="text-center text-sky-700">No books found.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {allBooks.map((book) => (
            <div
              key={book._id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md p-4 border border-transparent hover:border-sky-500 transition-all"
            >
              <div className="h-40 bg-sky-100 flex items-center justify-center">
                <FiBookOpen className="text-4xl text-sky-700" />
              </div>
              <div className="mt-3">
                <h3 className="font-semibold text-sky-800 line-clamp-2">
                  {book.title}
                </h3>
                <p className="text-sm text-sky-600 line-clamp-1">{book.author}</p>
                <Link
                  to={`/books/${book._id}`}
                  className="text-sky-600 hover:text-sky-800 text-sm font-medium block mt-2"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryBooks;
