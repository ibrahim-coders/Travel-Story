import { FaHeart } from 'react-icons/fa6';
import moment from 'moment';
import { IoLocationOutline } from 'react-icons/io5';

const TravelStoryCard = ({
  imgUrl,
  title,
  story,
  date,
  visitedLocation,
  isFavourite,
  onClick,
  onFavouriteClick,
}) => {
  return (
    <div className="relative border rounded-lg overflow-hidden bg-white hover:shadow-lg transition-all cursor-pointer">
      {/* Image */}
      <img
        src={imgUrl}
        alt={title}
        className="w-full h-56 object-cover"
        onClick={onClick}
      />

      {/* Favourite Button */}
      <button
        onClick={onFavouriteClick}
        className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-white/60 border border-white rounded-full hover:bg-white"
      >
        <FaHeart
          className={`text-lg ${
            isFavourite ? 'text-red-500' : 'text-gray-300'
          }`}
        />
      </button>

      {/* Content */}
      <div className="p-3" onClick={onClick}>
        {/* Title & Date */}
        <div className="mb-1">
          <h3 className="text-sm font-medium text-gray-800">{title}</h3>
          <span className="text-xs text-gray-500">
            {date ? moment(date).format('MMM Do YY') : '_'}
          </span>
        </div>

        {/* Story */}
        <p className="text-xs text-gray-600 mt-1">
          {story?.slice(0, 60)}
          {story?.length > 60 && '...'}
        </p>

        {/* Location */}

        <div className=" flex items-centertext-center gap-2 text-[13px] text-cyan-600 rounded  py-2">
          <span className="bg-cyan-50 flex gap-2 p-2">
            {' '}
            <IoLocationOutline className="text-sm" />
            {visitedLocation}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TravelStoryCard;
