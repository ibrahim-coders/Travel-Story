import { useState } from 'react';
import { MdAdd, MdClose, MdDeleteOutline, MdUpdate } from 'react-icons/md';
import axiosInstance from '../../utils/axiosInstance';
import toast from 'react-hot-toast';
import DateSelector from '../../components/DateSelector';
import ImageSelector from '../../components/ImageSelector';
import uploadImage from '../../utils/uploadImage';

const btn =
  'inline-flex items-center gap-1 text-xs font-medium bg-cyan-50 text-slate-600 ' +
  'border border-cyan-200 hover:bg-sky-600 hover:text-white rounded px-3 py-[3px]';

const label = 'text-xs font-medium text-slate-500';
const input =
  'w-full rounded border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500';

const AddEditTravelStory = ({
  storyInfo,
  type,
  onClose,
  getAllTravelStories,
}) => {
  const [title, setTitle] = useState(storyInfo?.title || '');
  const [storyImg, setStoryImg] = useState(storyInfo?.imageUrl || null);
  const [story, setStory] = useState(storyInfo?.story || '');

  const [visitedLocation, setVisitedLocation] = useState(
    storyInfo?.visitedLocation
  );
  const [visitDate, setVisitDate] = useState(
    storyInfo?.visitDate ? new Date(storyInfo.visitDate) : null
  );

  const handleAddUpdateClick = async () => {
    try {
      let imageUrl = null;
      // Validate fields before sending
      if (!title || !story || !visitedLocation || !visitDate) {
        toast.error('Please fill in all fields');
        return;
      }
      if (storyImg) {
        const res = await uploadImage({ imageFile: storyImg });
        imageUrl = res.imageUrl;
      }
      // Final validation including image
      if (!imageUrl) {
        toast.error('Please select and upload an image.');
        return;
      }
      const payload = {
        title,
        story,
        visitedLocation,
        imageUrl,
        visitDate: visitDate?.getTime(),
      };
      if (type === 'add') {
        await axiosInstance.post('/add-travel-story', payload);
        toast.success('Story added successfully');
      } else {
        await axiosInstance.put(`/edit-story/${storyInfo._id}`, payload);
        toast.success('Story updated successfully');
      }

      getAllTravelStories();
      onClose();
    } catch (err) {
      toast.error('Try again');
      console.error(err);
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h5 className="text-xl font-semibold text-slate-700">
          {type === 'add' ? 'Add Story' : 'Update Story'}
        </h5>
        <div className="flex flex-wrap gap-2">
          {type === 'add' ? (
            <button className={btn} onClick={handleAddUpdateClick}>
              <MdAdd className="text-lg" /> ADD STORY
            </button>
          ) : (
            <>
              <button className={btn} onClick={handleAddUpdateClick}>
                <MdUpdate className="text-lg" /> UPDATE
              </button>
              {/* <button
                className={`${btn} bg-red-50 border-red-200 hover:bg-red-600`}
                onClick={handleDelete}
              >
                <MdDeleteOutline className="text-lg" /> DELETE
              </button> */}
            </>
          )}
          <button className={btn} onClick={onClose}>
            <MdClose className="text-xl" />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
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

        <div>
          <label className={label}>VISITED LOCATION</label>
          <input
            value={visitedLocation}
            onChange={e => setVisitedLocation(e.target.value)}
            type="text"
            className={input}
            placeholder="Dhaka, Bangladesh"
            required
          />
        </div>

        <div>
          <label className={label}>VISIT DATE</label>
          <DateSelector date={visitDate} setDate={setVisitDate} />
        </div>

        <div>
          <label className={label}>IMAGE</label>

          <ImageSelector
            storyImg={storyImg}
            setStoryImg={setStoryImg}
            image={storyInfo}
          />
        </div>

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
