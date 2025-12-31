import { useParams, Link } from "react-router-dom";
import { useGetBookQuery } from "../features/books/booksApi";
import { FiEdit2, FiArrowLeft, FiBookOpen } from "react-icons/fi";
import { motion } from "framer-motion";

const BookDetails = () => {
  const { id } = useParams();
  const { data: book, isLoading, isError } = useGetBookQuery(id!);

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-sky-50 p-4">
        <div className="text-center">
          <FiBookOpen className="animate-pulse text-sky-500 text-4xl mx-auto mb-4" />
          <p className="text-sky-700">Loading book details...</p>
        </div>
      </div>
    );

  if (isError || !book)
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-sky-50 p-4">
        <div className="text-center">
          <FiBookOpen className="text-sky-500 text-4xl mx-auto mb-4" />
          <p className="text-red-600 mb-4">Failed to load book details.</p>
          <Link to="/" className="text-sky-600 hover:text-sky-800 font-medium">
            Back to home
          </Link>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-sky-100 pt-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <motion.div
          className="mt-15"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Link
            to="/books"
            className="inline-flex items-center text-sky-600 hover:text-sky-800 mb-6 transition-colors"
          >
            <FiArrowLeft className="mr-2" />
            Back to all books
          </Link>
        </motion.div>

        {/* Book Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-sky-200"
        >
          <div className="p-6 sm:p-8">
            {/* Title and Author */}
            <div className="mb-6">
              <motion.h1
                className="text-3xl font-bold text-sky-900 mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {book.title}
              </motion.h1>
              <motion.p
                className="text-xl text-sky-700"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                By {book.author}
              </motion.p>
            </div>

            {/* Book Details Grid */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="bg-sky-50/50 p-4 rounded-lg">
                <h2 className="text-sm font-medium text-sky-600 mb-1">Genre</h2>
                <p className="text-lg font-medium text-sky-900">{book.genre}</p>
              </div>

              <div className="bg-sky-50/50 p-4 rounded-lg">
                <h2 className="text-sm font-medium text-sky-600 mb-1">ISBN</h2>
                <p className="text-lg font-medium text-sky-900">{book.isbn}</p>
              </div>

              <div className="bg-sky-50/50 p-4 rounded-lg">
                <h2 className="text-sm font-medium text-sky-600 mb-1">
                  Copies Available
                </h2>
                <p className="text-lg font-medium text-sky-900">
                  {book.copies}
                </p>
              </div>

              <div className="bg-sky-50/50 p-4 rounded-lg">
                <h2 className="text-sm font-medium text-sky-600 mb-1">
                  Status
                </h2>
                <span
                  className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full 
                  ${
                    book.available
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {book.available ? "Available" : "Unavailable"}
                </span>
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className="text-sm font-medium text-sky-600 mb-2">
                Description
              </h2>
              <p className="text-sky-800 leading-relaxed">{book.description}</p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              className="flex flex-wrap gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Link
                to={`/edit-book/${book._id}`}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-all"
              >
                <FiEdit2 className="mr-2" />
                Edit Book
              </Link>

              <Link
                to={`/borrow/${book._id}`}
                className={`inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all
                  ${
                    book.available
                      ? "bg-green-600 hover:bg-green-700 focus:ring-green-500"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                onClick={(e) => !book.available && e.preventDefault()}
              >
                {book.available ? "Borrow Book" : "Not Available"}
              </Link>

              <Link
                to="/books"
                className="inline-flex items-center px-4 py-2 border border-sky-300 rounded-lg shadow-sm text-sm font-medium text-sky-700 bg-white hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-all"
              >
                Back to List
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BookDetails;
