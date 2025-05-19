import { useState, useEffect } from 'react';
import {
  MdAdd,
  MdClose,
  MdDeleteOutline,
  MdUpdate,
  MdImage,
} from 'react-icons/md';
import axiosInstance from '../../utils/axiosInstance';
import toast from 'react-hot-toast';
import DateSelector from '../../components/DateSelector';

const btn =
  'inline-flex items-center gap-1 text-xs font-medium bg-cyan-50 text-slate-600 ' +
  'border border-cyan-200 hover:bg-sky-600 hover:text-white rounded px-3 py-[3px]';

const label = 'text-xs font-medium text-slate-500';
const input =
  'w-full rounded border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500';

const AddEditTravelStory = ({
  storyInfo,
  type, // 'add' | 'edit'
  onClose,
  getAllTravelStories,
}) => {
  /* ---------- local form state ---------- */
  const [title, setTitle] = useState('');
  const [storyImg, setStoryImg] = useState(null); // File
  const [story, setStory] = useState('');
  const [visitedLocation, setVisitedLocation] = useState('');
  const [visitDate, setVisitDate] = useState(null);

  /* ---------- preload data for edit ---------- */
  useEffect(() => {
    if (type === 'edit' && storyInfo) {
      setTitle(storyInfo.title || '');
      setStory(storyInfo.story || '');
      setVisitedLocation(storyInfo.visitedLocation || '');
      setVisitDate(storyInfo.visitDate ? new Date(storyInfo.visitDate) : null);
    }
  }, [type, storyInfo]);

  /* ---------- submit handlers ---------- */
  const handleAddUpdateClick = async () => {
    const payload = new FormData();
    payload.append('title', title);
    payload.append('story', story);
    payload.append('visitedLocation', visitedLocation);
    payload.append('visitDate', visitDate);
    if (storyImg) payload.append('image', storyImg);

    try {
      if (type === 'add') {
        await axiosInstance.post('/add-story', payload);
        toast.success('Story added successfully');
      } else {
        await axiosInstance.put(`/update-story/${storyInfo._id}`, payload);
        toast.success('Story updated successfully');
      }
      getAllTravelStories();
      onClose();
    } catch (err) {
      toast.error('Please try again');
      console.error(err);
    }
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/delete-story/${storyInfo._id}`);
      toast.success('Story deleted');
      getAllTravelStories();
      onClose();
    } catch (err) {
      toast.error('Delete failed');
      console.error(err);
    }
  };

  /* ---------- render ---------- */
  return (
    <div className="flex flex-col gap-6">
      {/* top bar */}
      <div className="flex items-center justify-between">
        <h5 className="text-xl font-semibold text-slate-700">
          {type === 'add' ? 'Add Story' : 'Update Story'}
        </h5>

        <div className="flex gap-3">
          {type === 'add' ? (
            <button className={btn} onClick={handleAddUpdateClick}>
              <MdAdd className="text-lg" /> ADD STORY
            </button>
          ) : (
            <>
              <button className={btn} onClick={handleAddUpdateClick}>
                <MdUpdate className="text-lg" /> UPDATE
              </button>
              <button
                className={`${btn} bg-red-50 border-red-200 hover:bg-red-600`}
                onClick={handleDelete}
              >
                <MdDeleteOutline className="text-lg" /> DELETE
              </button>
            </>
          )}

          <button className={btn} onClick={onClose}>
            <MdClose className="text-xl" />
          </button>
        </div>
      </div>

      {/* form fields */}
      <div className="flex flex-col gap-4">
        {/* title */}
        <div>
          <label className={label}>TITLE</label>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            type="text"
            className={input}
            placeholder="A Day at the Great Wall"
            required
          />
        </div>

        {/* visited location */}
        <div>
          <label className={label}>VISITED LOCATION</label>
          <input
            value={visitedLocation}
            onChange={e => setVisitedLocation(e.target.value)}
            type="text"
            className={input}
            placeholder="Beijing, China"
            required
          />
        </div>

        {/* date */}
        <div>
          <label className={label}>VISIT DATE</label>
          <DateSelector date={visitDate} setDate={setVisitDate} />
        </div>

        {/* image upload */}
        <div>
          <label className={label}>IMAGE</label>
          <label
            className={`${input} flex items-center gap-2 cursor-pointer justify-center`}
          >
            <MdImage className="text-xl" />
            {storyImg ? storyImg.name : 'Select image'}
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={e => setStoryImg(e.target.files[0])}
            />
          </label>
        </div>

        {/* story text */}
        <div>
          <label className={label}>STORY</label>
          <textarea
            value={story}
            onChange={e => setStory(e.target.value)}
            className={`${input} h-28 resize-none`}
            placeholder="Write your travel experience..."
            required
          />
        </div>
      </div>
    </div>
  );
};

export default AddEditTravelStory;
