import Profile_Info from './Profile_Info';

const Navbar = ({ userInfo }) => {
  return (
    <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow sticky top-0 z-10">
      <h2 className="text-xl italic font-bold text-sky-600">
        Travel
        <br />
        Story
      </h2>
      <Profile_Info userInfo={userInfo} />
    </div>
  );
};

export default Navbar;
