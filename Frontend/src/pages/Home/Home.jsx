import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import Navbar from '../../components/Navbar';
import toast from 'react-hot-toast';
import { MdAdd } from 'react-icons/md';
import Modal from 'react-modal';
import AddEditTravelStory from './AddEditTravelStory';
import TravelStoryCard from '../../components/TravelStoryCard';
import ViewModelStory from './ViewModelStory';

Modal.setAppElement('#root');

const Home = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [stories, setStories] = useState([]);

  const [modalState, setModalState] = useState({
    isShow: false,
    type: 'add',
    story: null,
  });

  const [openviewModel, setViewModel] = useState({
    isShow: false,
    story: null,
  });

  // Fetch user info
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

  // Fetch all stories
  const fetchAllStories = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get('/get-all-stories');
      if (data?.stories) setStories(data.stories);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchUserInfo();
    fetchAllStories();
  }, [fetchUserInfo, fetchAllStories]);

  // Card Actions
  const handleEdit = story =>
    setModalState({ isShow: true, type: 'edit', story });

  const handleViewStory = story => {
    setViewModel({
      isShow: true,
      story: story,
    });
  };

  const toggleFavourite = async story => {
    try {
      const updatedFavourite = !story.isFavourite;

      // Optimistically update and sort
      setStories(prev => {
        const updated = prev.map(s =>
          s._id === story._id ? { ...s, isFavourite: updatedFavourite } : s
        );
        // Sort after update
        return [...updated].sort((a, b) => b.isFavourite - a.isFavourite);
      });

      const { data } = await axiosInstance.put(
        `/updated-favourite/${story._id}`,
        { isFavourite: updatedFavourite }
      );

      if (data?.story) {
        toast.success('Favourite updated');
      }
    } catch (err) {
      // Revert and sort
      setStories(prev => {
        const reverted = prev.map(s =>
          s._id === story._id ? { ...s, isFavourite: story.isFavourite } : s
        );
        return [...reverted].sort((a, b) => b.isFavourite - a.isFavourite);
      });

      toast.error('Failed to update favourite');
      console.error(err);
    }
  };

  const handleDelete = async storyId => {
    try {
      // Close modal first
      setViewModel({ isShow: false, story: null });

      await axiosInstance.delete(`/delete-story/${storyId}`);
      toast.success('Story deleted');

      setStories(prev => prev.filter(story => story._id !== storyId));
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Delete failed');
      console.error(err);
    }
  };

  return (
    <>
      <Navbar userInfo={userInfo} />

      <main className="container mx-auto py-10">
        {stories.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6">
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

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalState.isShow}
        onRequestClose={() =>
          setModalState({ isShow: false, type: 'add', story: null })
        }
        overlayClassName="fixed inset-0 bg-black/30 z-50 flex items-center justify-center px-4 overflow-y-auto"
        className="bg-white rounded-lg w-full max-w-2xl p-6 mt-10 mb-10 outline-none max-h-[90vh] overflow-y-auto"
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

      {/* View Modal */}
      <Modal
        isOpen={openviewModel.isShow}
        onRequestClose={() => setViewModel({ isShow: false, story: null })}
        overlayClassName="fixed inset-0 bg-black/30 z-50 flex items-center justify-center px-4 overflow-y-auto"
        className="bg-white rounded-lg w-full max-w-2xl p-6 mt-10 mb-10 outline-none max-h-[90vh] overflow-y-auto"
      >
        <ViewModelStory
          storyInfo={openviewModel.story}
          onEditClick={() => {
            setModalState({
              isShow: true,
              type: 'edit',
              story: openviewModel.story,
            });
            setViewModel({ isShow: false, story: null });
          }}
          onDeleteClick={() => handleDelete(openviewModel.story._id)}
          onClose={() => setViewModel({ isShow: false, story: null })}
        />
      </Modal>

      {/* Floating Add Button */}
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
