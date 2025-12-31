import { useParams, useNavigate } from "react-router-dom";
import { useDeleteBookMutation, useGetBookQuery } from "../features/books/booksApi";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FiTrash2, FiX, FiAlertTriangle } from "react-icons/fi";

const DeleteBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: book, isLoading, isError } = useGetBookQuery(id!);
  const [deleteBook, { isLoading: isDeleting }] = useDeleteBookMutation();

  const handleDelete = async () => {
    try {
      await deleteBook(id!).unwrap();
      toast.success("Book deleted successfully");
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete the book");
    }
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-50 to-sky-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500 mx-auto mb-4"></div>
        <p className="text-sky-700">Loading book details...</p>
      </div>
    </div>
  );

  if (isError || !book) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-50 to-sky-100">
      <motion.div 
        className="text-center p-6 max-w-md bg-white rounded-xl shadow-lg border border-sky-200"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
          <FiAlertTriangle className="h-6 w-6 text-red-600" />
        </div>
        <h3 className="text-lg font-medium text-sky-900 mb-2">Error loading book</h3>
        <p className="text-sm text-sky-700 mb-4">We couldn't load the book details. Please try again later.</p>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors"
        >
          Back to Home
        </button>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-sky-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <motion.div 
        className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-sky-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
            <FiTrash2 className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-sky-900">Delete Book</h2>
          <div className="mt-4">
            <p className="text-sky-700">
              Are you sure you want to delete <span className="font-semibold text-sky-900">"{book.title}"</span> by {book.author}?
            </p>
            <p className="mt-2 text-sm text-sky-600">
              This action cannot be undone and will permanently remove the book from the library.
            </p>
          </div>
        </div>
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <motion.button
            onClick={() => navigate(-1)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-sky-300 rounded-lg text-sky-700 hover:bg-sky-50 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FiX /> Cancel
          </motion.button>
          <motion.button
            onClick={handleDelete}
            disabled={isDeleting}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-white ${
              isDeleting ? 'bg-red-400' : 'bg-red-600 hover:bg-red-700'
            } transition-colors`}
            whileHover={{ scale: isDeleting ? 1 : 1.02 }}
            whileTap={{ scale: isDeleting ? 1 : 0.98 }}
          >
            {isDeleting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Deleting...
              </>
            ) : (
              <>
                <FiTrash2 /> Delete Book
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default DeleteBook;