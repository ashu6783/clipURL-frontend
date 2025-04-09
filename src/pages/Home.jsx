import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearToken } from '../redux/authSlice';

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const goToShorten = () => {
    navigate('/shorten');
  };

  const goToDashboard = () => {
    navigate('/dashboard');
  };

  const handleLogout = () => {
    dispatch(clearToken());
    navigate('/');
  };

  return (
    <div className="flex flex-col bg-teal-800 items-center justify-center h-screen ">
      <h1 className='text-3xl font-bold mb-8 text-white'>Happy to see you here let's make cumborsome url's look a bit easy for you 👋</h1>
      <h1 className="text-3xl font-bold mb-8">ClipURL</h1>
      <div className="space-y-4 flex flex-col">
        <button
          onClick={goToShorten}
          className="px-6 py-3 bg-violet-500 text-white rounded hover:bg-violet-600"
        >
          Shorten a URL
        </button>
        <button
          onClick={goToDashboard}
          className="px-6 py-3 bg-cyan-500 text-white rounded hover:bg-cyan-600"
        >
          View Dashboard
        </button>
        <button
          onClick={handleLogout}
          className="px-6 py-3 bg-teal-500 text-white rounded hover:bg-red-600"
        >
          Wanna go? 🥺
        </button>
      </div>
    </div>
  );
};

export default Home;