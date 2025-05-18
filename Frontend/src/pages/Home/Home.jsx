import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router‑dom';
import axiosInstance from '../../utils/axiosInstance';
import Navbar from '../../components/Navbar';
import TravelStoryCard from '../../components/TravelStoryCard';
import toast from 'react-hot-toast';
import { MdAdd } from 'react-icons/md';
import Modal from 'react-modal';
const Home = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [stories, setStories] = useState([]);
  const [opentAddEditModel, setOpenAddEditModel] = useState({
    isShow: false,
    type: 'add',
    date: 'null',
  });

  const fetchUserInfo = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get('/get-user');
      if (data?.user) setUserInfo(data.user);
    } catch (err) {
      if (err?.response?.status === 401) {
        localStorage.clear();
        navigate('/login', { replace: true });
      } else {
        console.error('Error fetching user info:', err);
      }
    }
  }, [navigate]);

  const fetchAllStories = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get('/get-all-stories');
      if (data?.stories) setStories(data.stories);
    } catch (err) {
      console.error('Error fetching stories:', err);
    }
  }, []);

  //  Lifecycle

  useEffect(() => {
    fetchUserInfo();
    fetchAllStories();
  }, [fetchUserInfo, fetchAllStories]);

  // Card‑level actions
  const handleEdit = story => {
    console.log('EDIT story', story);
  };

  const handleViewStory = story => {
    console.log('VIEW story', story);
  };

  const toggleFavourite = async story => {
    try {
      const response = await axiosInstance.put(
        '/update-favourite/' + story._id,
        { isFavourite: !story.isFavourite }
      );

      if (response.data && response.data.story) {
        toast.success('Story updated successfully');
        fetchAllStories();
      }
    } catch (err) {
      console.error('Error toggling favourite:', err);
    }
  };

  // Render
  return (
    <>
      <Navbar userInfo={userInfo} />

      <main className="container mx-auto py-10">
        {stories.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map(story => (
              <TravelStoryCard
                key={story._id}
                imgUrl={story.imageUrl}
                title={story.title}
                story={story.story}
                visitedLocation={story.visitedLocation}
                date={story.visitDate}
                isFavourite={story.isFavourite}
                onEdit={() => handleEdit(story)}
                onClick={() => handleViewStory(story)}
                onFavouriteClick={() => toggleFavourite(story)}
              />
            ))}
          </div>
        ) : (
          <p className="h-40 flex justify-center items-center text-lg text-gray‑500">
            No travel stories yet.
          </p>
        )}
      </main>

      <Modal
        isOpen={opentAddEditModel.isShow}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: 'rgba(0,0,0,0,2)',
            zIndex: 999,
          },
        }}
        appElement={document.getElementById('root')}
        className="model-box"
      />
      <button
        className="w-16 h-16 flex items-center justify-center rounded-full bg-sky-500 hover:bg-sky-700 fixed right-10 bottom-10 z-"
        onClick={() =>
          setOpenAddEditModel({ isShow: true, type: 'add', date: 'null' })
        }
      >
        <MdAdd className="text-[32px] text-white" />
      </button>
    </>
  );
};

export default Home;
