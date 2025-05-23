import { MdClose, MdDeleteOutline, MdUpdate } from 'react-icons/md';
import { GrMapLocation } from 'react-icons/gr';
import moment from 'moment';

const btn =
  'inline-flex items-center gap-1 text-xs font-medium bg-cyan-50 text-slate-600 ' +
  'border border-cyan-200 hover:bg-sky-600 hover:text-white rounded px-3 py-[3px]';

const ViewModelStory = ({ storyInfo, onEditClick, onDeleteClick, onClose }) => {
  return (
    <div className="relative">
      <div className="flex items-center justify-end">
        <div className="flex flex-wrap gap-2">
          <button className={btn} onClick={onEditClick}>
            <MdUpdate className="text-lg" /> UPDATE STORY
          </button>
          <button
            className={`${btn} bg-red-300  border-red-200 hover:bg-red-600 cursor-pointer`}
            onClick={onDeleteClick}
          >
            <MdDeleteOutline className="text-lg" /> DELETE
          </button>
          <button className={btn} onClick={onClose}>
            <MdClose className="text-xl" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-2 py-4">
        <h1 className="text-2xl text-slate-950">{storyInfo?.title}</h1>
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm text-slate-500">
            {storyInfo?.visitDate &&
              moment(storyInfo.visitDate).format('Do MMM YYYY')}
          </span>
        </div>
        <div className="flex items-center gap-2 text-[13px] text-cyan-600 bg-cyan-200/40 rounded px-2 py-1">
          <GrMapLocation className="text-sm" />
          {storyInfo?.visitedLocation}
        </div>
        <img
          src={storyInfo?.imageUrl}
          alt="Selected"
          className="w-full h-[300px] object-cover rounded-lg"
        />
        <div className="mt-4">
          <p className="text-slate-950 text-sm leading-6 text-justify whitespace-pre-line">
            {storyInfo?.story}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ViewModelStory;
