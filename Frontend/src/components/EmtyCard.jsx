import { Link } from 'react-router-dom';
import { MdTravelExplore } from 'react-icons/md';

const EmptyCard = ({ onAddClick }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center  p-6 ">
      <MdTravelExplore className="text-4xl text-cyan-400 mb-3 bg-cyan-100 " />
      <h2 className="text-lg font-semibold text-gray-600">
        No Travel Stories Yet
      </h2>
      <p className="text-sm text-gray-500 mt-1 mb-4">
        Start by sharing your first travel experience!
      </p>
      <Link
        onClick={onAddClick}
        className="inline-block px-4 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-700 transition"
      >
        Add New Story
      </Link>
    </div>
  );
};

export default EmptyCard;
