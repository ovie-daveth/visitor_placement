import {Link} from "react-router-dom"
import ptb_logo from "../assets/ptb_logo.png"

export default function Home() {

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="flex flex-col items-center animate-fade-in-up">
        <img
          src={ptb_logo}
          alt="PTB Logo"
          width={120}
          height={120}
          className="mb-6 animate-bounce"
        />
        <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4 text-center animate-fade-in">
          Welcome to <br />
          Visitor Management Portal
        </h1>
        <p className="text-lg text-gray-600 mb-8 text-center animate-fade-in delay-200">
          Manage your visitors efficiently and securely.
        </p>
        <Link to="/check-in" className="animate-fade-in delay-300">
          <button className="px-8 py-3 bg-blue-700 text-white rounded-lg shadow-lg hover:bg-blue-800 transition-all duration-200 animate-fade-in delay-300">
            Get Started
          </button>
        </Link>
      </div>
      <style>{`
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(40px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s cubic-bezier(0.4,0,0.2,1) both;
        }
        .animate-fade-in {
          animation: fade-in 1s both;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
      `}</style>
    </div>
  )
}
