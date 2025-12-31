import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAddBookMutation } from "../features/books/booksApi";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

const genreOptions = [
  "FICTION",
  "NON_FICTION",
  "SCIENCE",
  "HISTORY",
  "BIOGRAPHY",
  "FANTASY",
];

const AddBook = () => {
  const navigate = useNavigate();
  const [addBook] = useAddBookMutation();

  const [form, setForm] = useState({
    title: "",
    author: "",
    genre: "",
    isbn: "",
    description: "",
    copies: "",
  });

  // Floating bubbles state
  const [bubbles] = useState(() =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      size: Math.random() * 20 + 10,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 15 + Math.random() * 10,
    }))
  );

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "copies" ? (value === "" ? "" : Number(value)) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addBook({ ...form, copies: Number(form.copies) || 0 }).unwrap();
      toast.success("Book added successfully!");
      navigate("/books");
    } catch (error: unknown) {
      interface ErrorWithMessage {
        data: {
          message: string;
        };
      }
      if (
        typeof error === "object" &&
        error !== null &&
        "data" in error &&
        typeof (error as ErrorWithMessage).data === "object" &&
        (error as ErrorWithMessage).data !== null &&
        "message" in (error as ErrorWithMessage).data
      ) {
        toast.error((error as ErrorWithMessage).data.message);
      } else {
        toast.error("Failed to add book");
      }
    }
  };
  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren",
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 10,
      },
    },
  };

  interface Bubble {
    id: number;
    size: number;
    x: number;
    y: number;
    delay: number;
    duration: number;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-sky-100 pt-16 px-4 sm:px-6 lg:px-8 overflow-hidden relative">
      {/* Animated background elements */}
      {bubbles.map((bubble: Bubble) => (
        <motion.div
          key={bubble.id}
          className="absolute rounded-full bg-sky-200/30"
          style={{
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            left: `${bubble.x}%`,
            top: `${bubble.y}%`,
          }}
          animate={{
            y: [0, -40, 0],
            x: [0, 20, 0],
          }}
          transition={{
            duration: bubble.duration,
            delay: bubble.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      <div className="max-w-3xl mx-auto relative z-10 mt-10">
        {/* Animated header inside the box */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1
            className="text-3xl font-extrabold text-sky-900"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Add New Book
          </motion.h1>
          <motion.p
            className="mt-2 text-sm text-sky-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Fill in the details below to add a new book to the library
          </motion.p>
        </motion.div>

        <motion.div
          className="bg-white/90 backdrop-blur-sm shadow-lg rounded-xl p-6 sm:p-8 border border-sky-200/50"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              {/* Title */}
              <motion.div className="sm:col-span-6" variants={itemVariants}>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-sky-800"
                >
                  Title *
                </label>
                <div className="mt-1">
                  <motion.input
                    type="text"
                    name="title"
                    id="title"
                    value={form.title}
                    onChange={handleChange}
                    className="block w-full rounded-md border-sky-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm p-2 border bg-sky-50 hover:bg-sky-100/50 transition-all"
                    placeholder="Enter book title"
                    required
                    whileFocus={{
                      scale: 1.01,
                      boxShadow: "0 0 0 2px rgba(14, 165, 233, 0.5)",
                    }}
                  />
                </div>
              </motion.div>

              {/* Author */}
              <motion.div className="sm:col-span-3" variants={itemVariants}>
                <label
                  htmlFor="author"
                  className="block text-sm font-medium text-sky-800"
                >
                  Author *
                </label>
                <div className="mt-1">
                  <motion.input
                    type="text"
                    name="author"
                    id="author"
                    value={form.author}
                    onChange={handleChange}
                    className="block w-full rounded-md border-sky-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm p-2 border bg-sky-50 hover:bg-sky-100/50 transition-all"
                    placeholder="Enter author name"
                    required
                    whileFocus={{
                      scale: 1.01,
                      boxShadow: "0 0 0 2px rgba(14, 165, 233, 0.5)",
                    }}
                  />
                </div>
              </motion.div>

              {/* Genre */}
              <motion.div className="sm:col-span-3" variants={itemVariants}>
                <label
                  htmlFor="genre"
                  className="block text-sm font-medium text-sky-800"
                >
                  Genre *
                </label>
                <div className="mt-1">
                  <motion.select
                    id="genre"
                    name="genre"
                    value={form.genre}
                    onChange={handleChange}
                    className="block w-full rounded-md border-sky-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm p-2 border bg-sky-50 hover:bg-sky-100/50 transition-all"
                    required
                    whileFocus={{
                      scale: 1.01,
                      boxShadow: "0 0 0 2px rgba(14, 165, 233, 0.5)",
                    }}
                  >
                    <option value="">Select a genre</option>
                    {genreOptions.map((genre) => (
                      <option key={genre} value={genre}>
                        {genre
                          .replace("_", " ")
                          .toLowerCase()
                          .replace(/^\w/, (c) => c.toUpperCase())}
                      </option>
                    ))}
                  </motion.select>
                </div>
              </motion.div>

              {/* ISBN */}
              <motion.div className="sm:col-span-3" variants={itemVariants}>
                <label
                  htmlFor="isbn"
                  className="block text-sm font-medium text-sky-800"
                >
                  ISBN *
                </label>
                <div className="mt-1">
                  <motion.input
                    type="text"
                    name="isbn"
                    id="isbn"
                    value={form.isbn}
                    onChange={handleChange}
                    className="block w-full rounded-md border-sky-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm p-2 border bg-sky-50 hover:bg-sky-100/50 transition-all"
                    placeholder="Enter ISBN number"
                    required
                    whileFocus={{
                      scale: 1.01,
                      boxShadow: "0 0 0 2px rgba(14, 165, 233, 0.5)",
                    }}
                  />
                </div>
              </motion.div>

              {/* Copies */}
              <motion.div className="sm:col-span-3" variants={itemVariants}>
                <label
                  htmlFor="copies"
                  className="block text-sm font-medium text-sky-800"
                >
                  Copies Available *
                </label>
                <div className="mt-1">
                  <motion.input
                    type="number"
                    name="copies"
                    id="copies"
                    min="1"
                    value={form.copies}
                    onChange={handleChange}
                    className="block w-full rounded-md border-sky-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm p-2 border bg-sky-50 hover:bg-sky-100/50 transition-all"
                    whileFocus={{
                      scale: 1.01,
                      boxShadow: "0 0 0 2px rgba(14, 165, 233, 0.5)",
                    }}
                  />
                </div>
              </motion.div>

              {/* Description */}
              <motion.div className="sm:col-span-6" variants={itemVariants}>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-sky-800"
                >
                  Description *
                </label>
                <div className="mt-1">
                  <motion.textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={form.description}
                    onChange={handleChange}
                    className="block w-full rounded-md border-sky-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm p-2 border bg-sky-50 hover:bg-sky-100/50 transition-all"
                    placeholder="Enter book description"
                    required
                    whileFocus={{
                      scale: 1.01,
                      boxShadow: "0 0 0 2px rgba(14, 165, 233, 0.5)",
                    }}
                  />
                </div>
              </motion.div>
            </div>

            {/* Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3"
              variants={itemVariants}
            >
              <motion.button
                type="button"
                onClick={() => navigate("/")}
                className="inline-flex justify-center rounded-lg border border-sky-300 bg-white py-2 px-4 text-sm font-medium text-sky-700 shadow-sm hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition-all"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                className="inline-flex justify-center rounded-lg border border-transparent bg-gradient-to-r from-sky-600 to-sky-500 py-2 px-4 text-sm font-medium text-white shadow-sm hover:from-sky-700 hover:to-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition-all"
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 4px 12px rgba(2, 132, 199, 0.25)",
                }}
                whileTap={{ scale: 0.98 }}
              >
                Add Book
              </motion.button>
            </motion.div>
          </motion.form>
        </motion.div>
      </div>
    </div>
  );
};

export default AddBook;
