import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiBookOpen,
  FiSearch,
  FiPlus,
  FiShare2,
  FiBookmark,
  FiAward,
} from "react-icons/fi";

import { useGetBooksQuery } from "../features/books/booksApi";
import { FaSpinner } from "react-icons/fa";
import Hero from "./../components/layout/Hero";

import { useGetCategoryCountsQuery } from "../features/books/booksApi";
import Books from "@/pages/Books";

const knownCategories = [
  "FICTION",
  "NON_FICTION",
  "SCIENCE",
  "HISTORY",
  "BIOGRAPHY",
  "FANTASY",
];
const categoryIcons: Record<string, React.ReactNode> = {
  FICTION: "📖",
  NON_FICTION: "📚",
  SCIENCE: "🔬",
  HISTORY: "🏺",
  BIOGRAPHY: "👤",
  FANTASY: "🐉",
};
const Home = () => {
  // Move the hook call here
  const {
    data,
    isLoading,
    isError,
  } = useGetBooksQuery({ page: 1, limit: 5 });

  const {
    data: categories,
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useGetCategoryCountsQuery();

    const allBooks = data?.books || [];

  return (
    <div className="bg-sky-50">
      {/* Hero Section */}
      <Hero />

      {/* What You Can Do Section */}
      <Books />

      <section className="py-16 bg-sky-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-sky-900 mb-4">
              What can you do in LibroVault?
            </h2>
            <div className="h-1 w-20 mx-auto bg-gradient-to-r from-sky-300 to-blue-600 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              {
                icon: <FiSearch className="text-4xl text-sky-600 mb-4" />,
                title: "Discover Books",
                desc: "Find your next favorite read with our powerful search and recommendations.",
              },
              {
                icon: <FiPlus className="text-4xl text-sky-600 mb-4" />,
                title: "Add Books",
                desc: "Build your personal library by adding books to your collection.",
              },
              {
                icon: <FiBookmark className="text-4xl text-sky-600 mb-4" />,
                title: "Organize",
                desc: "Categorize books by genre, reading status, or custom tags.",
              },
              {
                icon: <FiShare2 className="text-4xl text-sky-600 mb-4" />,
                title: "Share",
                desc: "Recommend books to friends and see what others are reading.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-sky-50 p-6 rounded-xl shadow-sm hover:shadow-lg  hover:shadow-cyan-800 hover:scale-105 hover:bg-sky-200 transition-all duration-300 ease-in-out border border-transparent hover:border-sky-500"
              >
                <div className="text-center">
                  {feature.icon}
                  <h3 className="text-xl font-semibold text-sky-800 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sky-700 text-sm sm:text-base">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why LibroVault Section (Static Grid) */}
      <section className="py-16 bg-sky-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-sky-900 mb-4">
              Why LibroVault?
            </h2>
            <div className="h-1 w-20 mx-auto bg-gradient-to-r from-sky-300 to-blue-600 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {[
              {
                title: "Comprehensive Library",
                desc: "Access thousands of books across all genres with detailed information.",
                icon: <FiBookOpen className="text-5xl text-sky-600 mx-auto" />,
              },
              {
                title: "Personalized Experience",
                desc: "Get recommendations tailored to your reading preferences and history.",
                icon: <FiAward className="text-5xl text-sky-600 mx-auto" />,
              },
              {
                title: "Easy Management",
                desc: "Track what you've read, what you're reading, and what you want to read next.",
                icon: <FiBookmark className="text-5xl text-sky-600 mx-auto" />,
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-sky-50 p-6 rounded-xl shadow-sm hover:shadow-lg  hover:shadow-cyan-800 hover:scale-105 hover:bg-sky-200 transition-all duration-300 ease-in-out border border-transparent hover:border-sky-500"
              >
                <div className="mb-6">{item.icon}</div>
                <h3 className="text-2xl font-bold text-sky-800 mb-4">
                  {item.title}
                </h3>
                <p className="text-sky-700 text-base sm:text-lg">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="py-16 bg-sky-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Data fetching */}
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <FaSpinner className="animate-spin text-sky-600 text-4xl" />
            </div>
          ) : isError || !allBooks?.length ? (
            <div className="text-center text-sky-700">
              Failed to load featured books. Try again later.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {allBooks.map((book) => (
                  <div
                    key={book._id}
                    className="bg-sky-50  rounded-xl shadow-sm hover:shadow-lg  hover:shadow-cyan-800 hover:scale-105 hover:bg-sky-200 transition-all duration-300 ease-in-out border border-transparent hover:border-sky-500"
                  >
                    <div className="h-48 bg-sky-200 flex items-center justify-center">
                      <FiBookOpen className="text-5xl text-sky-600" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-sky-800 mb-1 line-clamp-2">
                        {book.title}
                      </h3>
                      <p className="text-sm text-sky-600 mb-2 line-clamp-1">
                        {book.author}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs bg-sky-100 text-sky-800 px-2 py-1 rounded">
                          {book.genre}
                        </span>
                        <Link
                          to={`/books/${book._id}`}
                          className="text-sky-600 hover:text-sky-800 text-sm font-medium"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center mt-10">
                <Link
                  to="/books"
                  className="inline-block px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg transition-colors"
                >
                  View All Books
                </Link>
              </div>
            </>
          )}
        </div>
      </section>


      {/* Featured Book Categories Section */}
      <section className="py-16 bg-sky-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-sky-900 mb-4">
              📚 Featured Book Categories
            </h2>
            <div className="h-1 w-20 mx-auto bg-gradient-to-r from-sky-300 to-blue-600 rounded-full"></div>
          </div>

          {categoriesLoading ? (
            <div className="text-center text-sky-600">
              Loading categories...
            </div>
          ) : categoriesError ? (
            <div className="text-center text-red-500">
              Failed to load categories.
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
            >
              {knownCategories.map((cat) => {
                const matched = categories?.find(
                  (c) => c._id.toUpperCase() === cat
                );
                return (
                  <motion.div
                    key={cat}
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="bg-white p-4 rounded-lg shadow-sm text-center transition-all duration-300  hover:shadow-cyan-800 hover:shadow-lg hover:-translate-y-1 border border-transparent hover:bg-sky-200 hover:border-sky-500"
                  >
                    <Link to={`/category/${cat.toLowerCase()}`}>
                      <div className="text-3xl mb-2">{categoryIcons[cat]}</div>
                      <h3 className="font-medium text-sky-800">
                        {cat.replace("_", " ")}
                      </h3>
                      <p className="text-sm text-sky-600">
                        {matched?.count || 0} books
                      </p>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
