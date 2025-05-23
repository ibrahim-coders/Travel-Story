import Profile_Info from './Profile_Info';
import SearchBar from './SearchBar';

const Navbar = ({
  userInfo,
  searchQuery,
  setSearchQuery,
  onSearcNote,
  handleClearSearch,
}) => {
  const handleSearch = () => {
    if (searchQuery) {
      onSearcNote(searchQuery);
    }
  };
  const onClearSearch = () => {
    handleClearSearch();
    setSearchQuery('');
  };
  return (
    <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow sticky top-0 z-10">
      <h2 className="text-xl italic font-bold text-sky-600">
        Travel
        <br />
        Story
      </h2>
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
