import { Outlet } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from './components/layout/Footer';


export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-sky-100 dark:bg-gray-900 transition-colors">
      <Navbar />

      {/* Toast notifications */}
      <ToastContainer position="bottom-right" autoClose={3000} />

      {/* Main Content */}
      <main className="w-full">
        <Outlet />
      </main>


      <Footer/>
    </div>
  );
}