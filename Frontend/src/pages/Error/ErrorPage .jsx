import { Link } from 'react-router-dom';

const ErrorPage = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-50 to-blue-100 px-4">
      <div className="text-center max-w-md">
        <img
          src="https://cdn-icons-png.flaticon.com/512/2748/2748558.png"
          alt="Not Found"
          className="w-40 mx-auto mb-6"
        />
        <h1 className="text-4xl font-bold text-cyan-600 mb-2">Oops!</h1>
        <p className="text-xl text-gray-700 mb-4">404 - Page Not Found</p>
        <p className="text-gray-500 mb-6">
          It looks like you're lost in paradise. Let's get you back to your
          travel journey!
        </p>
        <Link
          to="/dashboard"
          className="inline-block px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-700 transition"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
