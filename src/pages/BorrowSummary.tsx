import { useGetBorrowSummaryQuery } from "../features/borrow/borrowApi";
import { motion } from "framer-motion";
import { FiBook, FiAlertCircle, FiLoader } from "react-icons/fi";

const BorrowSummary = () => {
  const { data: summary, isLoading, isError } = useGetBorrowSummaryQuery();

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-sky-100 pt-16 px-4 sm:px-6 lg:px-8 overflow-hidden relative">
      {/* Main Content */}
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        {/* Animated Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-sky-900 mb-2">Borrow Summary</h1>
          <div className="h-1 w-20 bg-gradient-to-r from-sky-400 to-sky-600 rounded-full"></div>
        </motion.div>

        {/* Content */}
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center p-12 bg-white/90 rounded-xl shadow-sm border border-sky-200"
          >
            <FiLoader className="animate-spin text-sky-500 text-4xl mb-4" />
            <p className="text-sky-700">Loading summary data...</p>
          </motion.div>
        ) : isError ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center p-12 bg-white/90 rounded-xl shadow-sm border border-sky-200"
          >
            <FiAlertCircle className="text-sky-500 text-4xl mb-4" />
            <p className="text-sky-700">Error loading summary data</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
            >
              Retry
            </button>
          </motion.div>
        ) : summary?.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center p-12 bg-white/90 rounded-xl shadow-sm border border-sky-200 text-center"
          >
            <FiBook className="text-sky-400 text-4xl mb-4" />
            <h3 className="text-xl font-medium text-sky-800 mb-2">No Books Borrowed Yet</h3>
            <p className="text-sky-600 max-w-md">
              Your borrowed books will appear here once you check out some titles from our library.
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-sky-200"
          >
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-sky-200">
                <thead className="bg-sky-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-sky-700 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-sky-700 uppercase tracking-wider">
                      ISBN
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-sky-700 uppercase tracking-wider">
                      Quantity
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-sky-100">
                  {summary?.map((s, idx) => (
                    <motion.tr
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="hover:bg-sky-50/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-sky-900">{s.book.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-sky-700">{s.book.isbn}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-sky-100 text-sky-800">
                          {s.totalQuantity}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </main>

    </div>
  );
};

export default BorrowSummary;