import { useParams, useNavigate } from "react-router-dom";
import { useGetBookQuery } from "../features/books/booksApi";
import { useBorrowBookMutation } from "../features/borrow/borrowApi";
import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { useAppDispatch } from "../redux/hooks";
import { borrowApi } from "../features/borrow/borrowApi";
import {
  FiBook,
  FiCalendar,
  FiArrowLeft,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";

const Borrow = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const { data: book, isLoading, isError } = useGetBookQuery(bookId!);
  const [borrowBook, { isLoading: isSubmitting }] = useBorrowBookMutation();

  const [quantity, setQuantity] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [minDate, setMinDate] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    const minDateStr = today.toISOString().split("T")[0];
    setMinDate(minDateStr);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!book) {
      toast.error("Book not found");
      return;
    }

    if (!quantity || Number(quantity) < 1 || Number(quantity) > book.copies) {
      toast.error(`Please enter a quantity between 1 and ${book.copies}`);
      return;
    }

    if (!dueDate) {
      toast.error("Please select a due date");
      return;
    }

    try {
      await borrowBook({
        book: bookId!,
        quantity: Number(quantity),
        dueDate,
      }).unwrap();

      dispatch(
        borrowApi.util.updateQueryData(
          "getBorrowSummary",
          undefined,
          (draft) => {
            const existing = draft.find((entry) => entry.book._id === bookId);
            if (existing) {
              existing.totalQuantity += Number(quantity);
            } else {
              draft.push({
                book: {
                  _id: book._id,
                  title: book.title,
                  isbn: book.isbn,
                },
                totalQuantity: Number(quantity),
              });
            }
          }
        )
      );


      toast.success(
        <div className="flex items-center">
          <FiCheckCircle className="mr-2 text-green-500" />
          <span>
            {quantity} {Number(quantity) > 1 ? "copies" : "copy"} of "
            {book.title}" borrowed successfully!
          </span>
        </div>
      );

      navigate("/borrow-summary");
    } catch (err: unknown) {
      let errorMessage = "Failed to borrow book";

      if (err && typeof err === "object" && "data" in err) {
        const errorData = (err as { data: { message?: string } }).data;
        if (errorData?.message === "Book is already borrowed") {
          errorMessage = "This book is already borrowed by you";
        } else if (errorData?.message) {
          errorMessage = errorData.message;
        }
      }

      toast.error(
        <div className="flex items-center">
          <FiAlertCircle className="mr-2 text-red-500" />
          <span>{errorMessage}</span>
        </div>
      );
    }
  };

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-50 to-sky-100">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <FiBook className="animate-pulse text-sky-500 text-4xl mx-auto mb-4" />
          <p className="text-sky-700">Loading book details...</p>
        </motion.div>
      </div>
    );

  if (isError || !book)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-50 to-sky-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-sky-200 text-center max-w-md mx-4"
        >
          <FiAlertCircle className="text-red-500 text-4xl mx-auto mb-4" />
          <h3 className="text-xl font-bold text-sky-900 mb-2">
            Error Loading Book
          </h3>
          <p className="text-sky-700 mb-6">
            We couldn't load the book details. Please try again later.
          </p>
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
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-sky-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto mt-20 relative z-10">
        {/* Back Button */}
        <motion.button
          onClick={() => navigate(-1)}
          className="flex items-center text-sky-600 hover:text-sky-800 mb-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <FiArrowLeft className="mr-2" />
          Back to Book
        </motion.button>

        {/* Book Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-sky-200"
        >
          <div className="p-6 sm:p-8">
            <motion.h1
              className="text-2xl font-bold text-sky-900 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Borrow Book
            </motion.h1>

            {/* Book Info */}
            <motion.div
              className="mb-8 p-4 bg-sky-50 rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-lg font-semibold text-sky-800">
                {book.title}
              </h2>
              <p className="text-sky-700">By {book.author}</p>
              <div className="mt-3 flex justify-between items-center">
                <span className="text-sm text-sky-600">
                  Available: <span className="font-medium">{book.copies}</span>
                </span>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full 
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

            {/* Borrow Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Quantity Input */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="sm:col-span-3"
              >
                <label
                  htmlFor="quantity"
                  className="block text-sm font-medium text-sky-800"
                >
                  Quantity *
                </label>
                <div className="mt-1">
                  <motion.input
                    type="number"
                    id="quantity"
                    name="quantity"
                    min="1"
                    max={book.copies}
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="block w-full rounded-md border-sky-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm p-2 border bg-sky-50 hover:bg-sky-100/50 transition-all"
                    required
                    disabled={!book.available}
                    whileFocus={{
                      scale: 1.01,
                      boxShadow: "0 0 0 2px rgba(14, 165, 233, 0.5)",
                    }}
                  />
                  {Number(quantity) > book.copies && (
                    <p className="mt-1 text-sm text-red-600">
                      Only {book.copies} {book.copies === 1 ? "copy" : "copies"}{" "}
                      available
                    </p>
                  )}
                </div>
              </motion.div>

              {/* Due Date Input */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <label
                  htmlFor="dueDate"
                  className="block text-sm font-medium text-sky-700 mb-1"
                >
                  Due Date
                </label>
                <div className="relative">
                  <input
                    ref={inputRef}
                    type="date"
                    id="dueDate"
                    value={dueDate}
                    min={minDate}
                    onChange={(e) => {
                      const selectedDate = e.target.value;
                      setDueDate(selectedDate);
                    }}
                    className="w-full px-3 py-2 border border-sky-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 bg-sky-50"
                    required
                    disabled={!book.available}
                  />
                  <FiCalendar
                    className="absolute right-3 top-2.5 text-sky-400 cursor-pointer"
                    onClick={() => {
                      if (inputRef.current) {
                        inputRef.current.showPicker?.();
                        inputRef.current.focus();
                      }
                    }}
                  />
                </div>
                {dueDate && (
                  <p
                    className={`mt-1 text-sm ${
                      new Date(dueDate) < new Date(minDate)
                        ? "text-red-600"
                        : "text-sky-600"
                    }`}
                  >
                    {new Date(dueDate) < new Date(minDate)
                      ? "Due date must be at least tomorrow"
                      : "Selected return date: " +
                        new Date(dueDate).toLocaleDateString()}
                  </p>
                )}
              </motion.div>

              {/* Submit Button */}
              <motion.div
                className="pt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <button
                  type="submit"
                  disabled={!book.available || isSubmitting}
                  className={`w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-all ${
                    !book.available
                      ? "bg-gray-400 cursor-not-allowed"
                      : isSubmitting
                      ? "bg-sky-500"
                      : "bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-700 hover:to-sky-600 hover:shadow-md"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>{book.available ? "Borrow Book" : "Not Available"}</>
                  )}
                </button>
              </motion.div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Borrow;
