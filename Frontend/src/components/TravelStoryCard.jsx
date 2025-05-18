import { FaHeart } from 'react-icons/fa6';
import { GrMapLocation } from 'react-icons/gr';
import moment from 'moment';
const TravelStoryCard = ({
  imgUrl,
  title,
  story,
  date,
  visitedLocation,
  isFavourite,
  onEdit,
  onClick,
  onFavouriteClick,
}) => {
  return (
    <div className="border rounded-lg overflow-hidden bg-white hover:shadow-lg hover:shadow-slate-200 transition-all ease-in-out relative cursor-pointer">
      <img
        src={imgUrl}
        alt="title"
        className="w-full h-56 object-cover rounded-lg"
        onClick={onClick}
      />
      <button
        className="w-12 h-12 flex items-center justify-center bg-white/40 border border-white/30 absolute top-4 right-4"
        onClick={onFavouriteClick}
      >
        <FaHeart
          className={`icon-btn ${isFavourite ? 'text-red-500' : 'text-white'}`}
        />
      </button>
      <div className="flex items-center gap-3" onClick={onClick}>
        <div className="flex-1">
          <h6 className="text-xs text-slate-500">{title}</h6>
          <span className="text-xs text-slate-500">
            {date ? moment(date).format('MMM Do YY') : '_'}
          </span>
        </div>
      </div>
      <p className="text-xs text-slate-500 mt-2">{story?.slice(0, 60)}</p>
      <div clasNAme="inline-flex items-center gap-2 text-[13px] text-cyan-600 bg-cyan-200/40 rounded mt-3 px-2 py-1 ">
        <GrMapLocation className="text-sm" />
        {visitedLocation.map((item, index) =>
          location.length == index + 1 ? `${item}` : `${item}`
        )}
      </div>
    </div>
  );
};

export default TravelStoryCard;
