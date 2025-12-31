import { Link } from "react-router-dom";
import { FiBookOpen } from "react-icons/fi";

const Hero = () => {
  return (
    <section className="relative bg-sky-50 text-sky-900 py-24 overflow-hidden mt-10">
      {/* Background Image */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center scale-105"
        style={{
          backgroundImage:
            "url('https://www.samdu.uz/upload/cover-images/63b451b1cbc7f-63b451b1cbc82-63b451b1cbc83-63b451b1cbc84.jpg')",
            
        }}
      ></div>

      {/* Foreground Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <FiBookOpen className="text-sky-100 text-5xl" />
          </div>
          {/* Heading */}
          <h1
            className="text-4xl md:text-5xl font-bold mb-4 leading-tight text-transparent bg-clip-text relative"
            style={{
              backgroundImage: `linear-gradient(
                    to right,
                    #0c4a6e, #075985, #0369a1, #0284c7, #0ea5e9,
                    #38bdf8, #7dd3fc, #bae6fd, #e0f2fe, #f0f9ff,
                    #e0f2fe, #bae6fd, #7dd3fc, #38bdf8, #0ea5e9,
                    #0284c7, #0369a1, #075985, #0c4a6e
                    )`,
              backgroundSize: "400% auto",
              animation: "gradientFlow 12s linear infinite",
            }}
          >
            Discover Your Next Great Read
          </h1>

          {/* Animation Style */}
          <style>
            {`
                    @keyframes gradientFlow {
                    0% {
                        background-position: 0% center;
                    }
                    100% {
                        background-position: 400% center;
                    }
                    }
                `}
          </style>

          {/* Gradient Underline */}
          <div className="h-1 w-24 mx-auto bg-gradient-to-r from-sky-300 to-blue-600 rounded-full mb-4"></div>

          {/* Tagline */}
          <p className="text-lg md:text-xl text-sky-100 italic mb-6">
            Explore books in:{" "}
            <span className="font-semibold animate-pulse text-cyan-400">
              Science
            </span>
            , History, Tech, Fiction, Biography...
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
            <Link
              to="/books"
              className="px-8 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg transition-colors shadow-lg flex items-center justify-center"
            >
              Browse Collection
            </Link>
            <Link
              to="/create-book"
              className="px-8 py-3 border-2 border-sky-100 hover:bg-sky-100 hover:text-sky-900 font-semibold rounded-lg transition-colors flex items-center justify-center text-sky-100"
            >
              Add New Book
            </Link>
          </div>
        </div>
      </div>

      {/* Floating Book Icons */}
      <div className="absolute bottom-0 left-0 w-full h-20 overflow-hidden z-10">
        {["📚", "📖", "🖋️", "📕", "📗", "📘", "📙", "📚", "📖", "🖋️", "📕"].map(
          (icon, index) => (
            <div
              key={index}
              className="absolute text-2xl opacity-70 text-sky-100"
              style={{
                bottom: "10%",
                left: `${Math.random() * 100}%`,
                animation: `float ${6 + Math.random() * 10}s linear infinite`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            >
              {icon}
            </div>
          )
        )}
      </div>

      {/* Float Animation Style */}
      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
            100% { transform: translateY(0); }
          }
        `}
      </style>
    </section>
  );
};

export default Hero;

