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
import EmptyCard from '../../components/EmtyCard';
import { DayPicker } from 'react-day-picker';
import moment from 'moment';
Modal.setAppElement('#root');

const Home = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [stories, setStories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRanget] = useState({ from: null, to: null });

  const [modalState, setModalState] = useState({
    isShow: false,
    type: 'add',
    story: null,
  });

  const [openviewModel, setViewModel] = useState({
    isShow: false,
    story: null,
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

  useEffect(() => {
    fetchUserInfo();
    fetchAllStories();
  }, [fetchUserInfo, fetchAllStories]);

  const handleEdit = story =>
    setModalState({ isShow: true, type: 'edit', story });

  const handleViewStory = story => {
    setViewModel({ isShow: true, story });
  };

  const toggleFavourite = async story => {
    try {
      const updatedFavourite = !story.isFavourite;
      setStories(prev =>
        [
          ...prev.map(s =>
            s._id === story._id ? { ...s, isFavourite: updatedFavourite } : s
          ),
        ].sort((a, b) => b.isFavourite - a.isFavourite)
      );
      const { data } = await axiosInstance.put(
        `/updated-favourite/${story._id}`,
        {
          isFavourite: updatedFavourite,
        }
      );
      if (data?.story) toast.success('Favourite updated');
    } catch (err) {
      setStories(prev =>
        [
          ...prev.map(s =>
            s._id === story._id ? { ...s, isFavourite: story.isFavourite } : s
          ),
        ].sort((a, b) => b.isFavourite - a.isFavourite)
      );
      toast.error('Failed to update favourite');
      console.error(err);
    }
  };

  const handleDelete = async storyId => {
    try {
      setViewModel({ isShow: false, story: null });
      await axiosInstance.delete(`/delete-story/${storyId}`);
      toast.success('Story deleted');
      setStories(prev => prev.filter(story => story._id !== storyId));
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Delete failed');
      console.error(err);
    }
  };

  const onSearchStory = async query => {
    try {
      const response = await axiosInstance.post('/search-story', { query });
      if (response.data?.stories) {
        setStories(response.data.stories);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    fetchAllStories();
  };

  const filterStoriesByDate = async range => {
    try {
      const startDate = range.from ? moment(range.from).valueOf() : null;
      const endDate = range.to ? moment(range.to).valueOf() : null;
      console.log(startDate, endDate);
      if (startDate && endDate) {
        const response = await axiosInstance.get('/travle-story/filter', {
          params: {
            startDate,
            endDate,
          },
        });
        console.log(response);
        if (response.data?.stories) {
          setStories(response.data.stories);
        }
      }
    } catch (error) {
      console.error('Error filtering stories by date:', error);
    }
  };

  const handleDayClick = day => {
    setDateRanget(day);
    filterStoriesByDate(day);
  };

  return (
    <>
      <Navbar
        userInfo={userInfo}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchNote={onSearchStory}
        handleClearSearch={handleClearSearch}
      />
      <main className="container mx-auto py-10 px-4">
        <div className="flex flex-col-reverse lg:flex-row gap-6">
          <div className="flex-1">
            {stories.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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
              <EmptyCard
                onAddClick={() =>
                  setModalState({ isShow: true, type: 'add', story: null })
                }
                onClose={() =>
                  setModalState({ isShow: false, type: 'add', story: null })
                }
              />
            )}
          </div>
          <div className="w-full lg:w-[320px]">
            <div className="bg-white border border-slate-200 shadow-lg shadow-slate-200/60 rounded-lg">
              <div className="p-3 flex justify-center items-center md:flex-col">
                <DayPicker
                  captionLayout="dropdown-buttons"
                  mode="range"
                  selected={dateRange}
                  onSelect={handleDayClick}
                  pageNavigation={true}
                />
              </div>
            </div>
          </div>
        </div>
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
