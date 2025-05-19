import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import Navbar from '../../components/Navbar';
import toast from 'react-hot-toast';
import { MdAdd } from 'react-icons/md';
import Modal from 'react-modal';
import AddEditTravelStory from './AddEditTravelStory';
import TravelStoryCard from '../../components/TravelStoryCard';

Modal.setAppElement('#root');

const Home = () => {
  const navigate = useNavigate();

  // -------- State --------
  const [userInfo, setUserInfo] = useState(null);
  const [stories, setStories] = useState([]);

  const [modalState, setModalState] = useState({
    isShow: false,
    type: 'add',
    story: null,
  });

  // -------- API Calls --------
  const fetchUserInfo = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get('/get-user');
      if (data?.user) setUserInfo(data.user);
    } catch (err) {
      if (err?.response?.status === 401) {
        localStorage.clear();
        navigate('/login', { replace: true });
      } else {
        console.error(err);
      }
    }
  }, [navigate]);

  const fetchAllStories = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get('/get-all-stories');
      if (data?.stories) setStories(data.stories);
    } catch (err) {
      console.error(err);
    }
  }, []);

  // -------- Lifecycle --------
  useEffect(() => {
    fetchUserInfo();
    fetchAllStories();
  }, [fetchUserInfo, fetchAllStories]);

  // -------- Card Actions --------
  const handleEdit = story =>
    setModalState({ isShow: true, type: 'edit', story });

  const handleViewStory = story =>
    navigate(`/story/${story._id}`, { state: story });

  const toggleFavourite = async story => {
    try {
      const { data } = await axiosInstance.put(
        `/update-favourite/${story._id}`,
        { isFavourite: !story.isFavourite }
      );
      if (data?.story) {
        toast.success('Story updated successfully');
        fetchAllStories();
      }
    } catch (err) {
      toast.error('Failed to update favourite');
      console.error(err);
    }
  };

  // -------- Render --------
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
          <p className="h-40 flex justify-center items-center text-lg text-gray-500">
            No travel stories yet.
          </p>
        )}
      </main>

      {/* ---------- Modal ---------- */}
      <Modal
        isOpen={modalState.isShow}
        onRequestClose={() =>
          setModalState({ isShow: false, type: 'add', story: null })
        }
        overlayClassName="fixed inset-0 bg-black/20 z-50 flex items-center justify-center"
        className="bg-white rounded-lg w-full max-w-xl p-6 outline-none"
      >
        <AddEditTravelStory
          type={modalState.type}
          storyInfo={modalState.story}
          onClose={() =>
            setModalState({ isShow: false, type: 'add', story: null })
          }
          getAllTravelStories={fetchAllStories}
        />
      </Modal>

      {/* ---------- Floating Add Button ---------- */}
      <button
        className="w-16 h-16 flex items-center justify-center rounded-full bg-sky-500 hover:bg-sky-700 fixed right-10 bottom-10 z-40 shadow-lg cursor-pointer"
        onClick={() =>
          setModalState({ isShow: true, type: 'add', story: null })
        }
      >
        <MdAdd className="text-[32px] text-white" />
      </button>
    </>
  );
};

export default Home;
