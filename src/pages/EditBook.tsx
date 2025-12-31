import { useParams, useNavigate } from "react-router-dom";
import {
  useGetBookQuery,
  useUpdateBookMutation,
} from "../features/books/booksApi";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FiSave, FiArrowLeft, FiBook, FiLoader } from "react-icons/fi";

import { booksApi } from "../features/books/booksApi";
import { useAppDispatch } from "../redux/hooks";

const EditBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: book, isLoading, isError } = useGetBookQuery(id!);
  const [updateBook] = useUpdateBookMutation();

  const dispatch = useAppDispatch();

  const [form, setForm] = useState({
    title: "",
    author: "",
    genre: "",
    isbn: "",
    description: "",
    copies: "",
  });

  useEffect(() => {
    if (book) {
      setForm({
        title: book.title,
        author: book.author,
        genre: book.genre,
        isbn: book.isbn,
        description: book.description,
        copies: book.copies.toString(),
      });
    }
  }, [book]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "copies" ? (value === "" ? "" : value) : value,
    }));
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   try {
  //     await updateBook({
  //       id: id!,
  //       book: {
  //         ...form,
  //         copies: Number(form.copies),
  //         available: Number(form.copies) > 0,
  //       },
  //     }).unwrap();
  //     toast.success("Book updated successfully");
  //     navigate("/");
  //   } catch {
  //     toast.error("Failed to update book");
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updated = await updateBook({
        id: id!,
        book: {
          ...form,
          copies: Number(form.copies),
          available: Number(form.copies) > 0,
        },
      }).unwrap();

      dispatch(
        booksApi.util.updateQueryData("getBook", id!, (draft) => {
          Object.assign(draft, updated);
        })
      );

      dispatch(
        booksApi.util.updateQueryData(
          "getBooks",
          { page: 1, limit: 12 },
          (draft) => {
            const index = draft.books.findIndex((b) => b._id === id);
            if (index !== -1) {
              draft.books[index] = { ...draft.books[index], ...updated };
            }
          }
        )
      );

      toast.success("Book updated successfully");
      navigate("/books");
    } catch {
      toast.error("Failed to update book");
    }
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-sky-50 p-4">
        <div className="text-center">
          <FiLoader className="animate-spin text-sky-500 text-4xl mx-auto mb-4" />
          <p className="text-sky-700">Loading book details...</p>
        </div>
      </div>
    );

  if (isError)
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-sky-50 p-4">
        <div className="text-center">
          <FiBook className="text-sky-500 text-4xl mx-auto mb-4" />
          <p className="text-red-600 mb-4">Error loading book details</p>
          <button
            onClick={() => navigate("/")}
            className="text-sky-600 hover:text-sky-800 font-medium"
          >
            Back to home
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-sky-100 pt-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-sky-600 hover:text-sky-800 mb-6 transition-colors mt-10"
          >
            <FiArrowLeft className="mr-2" />
            Back to book
          </button>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-sky-200"
        >
          <div className="p-6 sm:p-8">
            <motion.h1
              className="text-2xl font-bold text-sky-900 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Edit Book Details
            </motion.h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-sky-700 mb-1"
                >
                  Title *
                </label>
                <input
                  name="title"
                  id="title"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full rounded-md border-sky-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm p-2 border bg-sky-50 hover:bg-sky-100/50 transition-all"
                  required
                />
              </motion.div>

              {/* Author */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
              >
                <label
                  htmlFor="author"
                  className="block text-sm font-medium text-sky-700 mb-1"
                >
                  Author *
                </label>
                <input
                  name="author"
                  id="author"
                  value={form.author}
                  onChange={handleChange}
                  className="w-full rounded-md border-sky-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm p-2 border bg-sky-50 hover:bg-sky-100/50 transition-all"
                  required
                />
              </motion.div>

              {/* Genre */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <label
                  htmlFor="genre"
                  className="block text-sm font-medium text-sky-700 mb-1"
                >
                  Genre *
                </label>
                <select
                  name="genre"
                  id="genre"
                  value={form.genre}
                  onChange={handleChange}
                  className="w-full rounded-md border-sky-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm p-2 border bg-sky-50 hover:bg-sky-100/50 transition-all"
                  required
                >
                  <option value="">-- Select Genre --</option>
                  <option value="FICTION">Fiction</option>
                  <option value="NON_FICTION">Non-fiction</option>
                  <option value="SCIENCE">Science</option>
                  <option value="HISTORY">History</option>
                  <option value="BIOGRAPHY">Biography</option>
                  <option value="FANTASY">Fantasy</option>
                </select>
              </motion.div>

              {/* ISBN */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
              >
                <label
                  htmlFor="isbn"
                  className="block text-sm font-medium text-sky-700 mb-1"
                >
                  ISBN *
                </label>
                <input
                  name="isbn"
                  id="isbn"
                  value={form.isbn}
                  onChange={handleChange}
                  className="w-full rounded-md border-sky-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm p-2 border bg-sky-50 hover:bg-sky-100/50 transition-all"
                  required
                />
              </motion.div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-sky-700 mb-1"
                >
                  Description
                </label>
                <textarea
                  name="description"
                  id="description"
                  rows={4}
                  value={form.description}
                  onChange={handleChange}
                  className="w-full rounded-md border-sky-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm p-2 border bg-sky-50 hover:bg-sky-100/50 transition-all"
                />
              </motion.div>

              {/* Copies */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.55 }}
              >
                <label
                  htmlFor="copies"
                  className="block text-sm font-medium text-sky-700 mb-1"
                >
                  Copies Available *
                </label>
                <input
                  name="copies"
                  id="copies"
                  type="number"
                  min="0"
                  value={form.copies}
                  onChange={handleChange}
                  className="w-full rounded-md border-sky-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm p-2 border bg-sky-50 hover:bg-sky-100/50 transition-all"
                  required
                />
              </motion.div>

              {/* Submit Button */}
              <motion.div
                className="pt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-700 hover:to-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-all hover:scale-[1.02]"
                >
                  <FiSave className="mr-2" />
                  Update Book
                </button>
              </motion.div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EditBook;
