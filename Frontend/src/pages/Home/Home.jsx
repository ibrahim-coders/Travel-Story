import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { useEffect } from 'react';

const Home = () => {
  const navigate = useNavigate();
  const [userInfo, setUserinfo] = useState(null);
  const [allStories, setStrories] = useState([]);

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get('/get-user');
      if (response.status && response.data?.user) {
        setUserinfo(response.data?.user);
      }
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate('/login');
      }
    }
  };

  //get User info
  const getAllTravelStories = async () => {
    try {
      const response = await axiosInstance.get('/get-all-stories');
      if (response.data && response.data.stories) {
        setStrories(response.data.stories);
      }
    } catch (error) {
      console.log('An unexpected error occurred.Plese try again', error);
    }
  };

  useEffect(() => {
    getUserInfo();
    getAllTravelStories();
  }, []);
  console.log(userInfo);
  return (
    <>
      <Navbar userInfo={userInfo} />
      <div className="container mx-auto py-10">
        <div className="flex-1 gap-7"></div>
        <div className="w-[320px]"></div>
      </div>
    </>
  );
};

export default Home;
