import { Link, useNavigate } from 'react-router-dom';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6';
import { useState } from 'react';

import toast from 'react-hot-toast';
import axiosInstance from '../../utils/axiosInstance';

const SignUp = () => {
  const navigate = useNavigate();
  const [isShowPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  const [isError, setIsError] = useState('');
  const [error, setError] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  const handleSignUp = async e => {
    e.preventDefault();
    const { fullName, email, password } = formData;

    let isValid = true;
    const newError = { fullName: '', email: '', password: '' };

    if (!fullName) {
      newError.fullName = 'Name is required!';
      isValid = false;
    }
    if (!email) {
      newError.email = 'Email is required!';
      isValid = false;
    }
    if (!password) {
      newError.password = 'Password is required!';
      isValid = false;
    }

    setError(newError);
    if (!isValid) return;

    try {
      const response = await axiosInstance.post('/create-account', formData);
      toast.success(response.data?.message);
      console.log(response.data);
      if (response.data?.accessToken) {
        localStorage.setItem('token', response.data.accessToken);
        navigate('/dashboard');
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setIsError(error.response.data.message);
      } else {
        setIsError('An unexpected error occurred');
      }
    }

    setFormData({ fullName: '', email: '', password: '' });
  };

  return (
    <div className="h-screen bg-cyan-50 overflow-hidden flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="mb-6 text-center">
          <h4 className="text-3xl font-bold text-cyan-700">Blog Journeys</h4>
          <p className="text-gray-600 mt-2">
            Create an account to begin your travel journey logs.
          </p>
        </div>

        <form onSubmit={handleSignUp}>
          <h4 className="text-2xl font-semibold mb-6 text-center">Sign Up</h4>

          <input
            type="text"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={e =>
              setFormData({ ...formData, fullName: e.target.value })
            }
            className="w-full px-4 py-2 mb-2 border rounded outline-none bg-cyan-600/5"
          />
          {error.fullName && (
            <p className="text-red-500 text-sm mb-2">{error.fullName}</p>
          )}

          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-2 mb-2 border rounded outline-none bg-cyan-600/5"
          />
          {error.email && (
            <p className="text-red-500 text-sm mb-2">{error.email}</p>
          )}

          <div className="relative">
            <input
              type={isShowPassword ? 'text' : 'password'}
              placeholder="Password"
              value={formData.password}
              onChange={e =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full px-4 py-2 mb-2 border rounded outline-none bg-cyan-600/5"
            />
            <div className="absolute top-2.5 right-2">
              <button
                type="button"
                onClick={() => setShowPassword(!isShowPassword)}
                className="text-xl text-cyan-700"
              >
                {isShowPassword ? <FaRegEye /> : <FaRegEyeSlash />}
              </button>
            </div>
          </div>
          {error.password && (
            <p className="text-red-500 text-sm mb-2">{error.password}</p>
          )}

          {isError && <p className="text-red-500 text-sm mb-4">{isError}</p>}

          <button
            type="submit"
            className="w-full bg-cyan-500 text-white py-2 rounded hover:bg-cyan-700 cursor-pointer"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-4 text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-cyan-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
