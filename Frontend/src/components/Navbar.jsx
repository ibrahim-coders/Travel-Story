import Profile_Info from './Profile_Info';
import SearchBar from './SearchBar';
import logo from '../assets/logo.png';

const Navbar = ({
  userInfo,
  searchQuery,
  setSearchQuery,
  onSearchNote,
  handleClearSearch,
}) => {
  const handleSearch = () => {
    if (searchQuery) {
      onSearchNote(searchQuery);
    }
  };
  const onClearSearch = () => {
    handleClearSearch();
    setSearchQuery('');
  };
  return (
    <div className="bg-white flex items-center justify-between px-4 py-2 drop-shadow sticky top-0 z-10">
      <img src={logo} alt="" className="w-15 h-16 rounded-full" />
      <>
        <SearchBar
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          onSearch={handleSearch}
          onClearSearch={onClearSearch}
        />

        <Profile_Info userInfo={userInfo} />
      </>
    </div>
  );
};

export default Navbar;
