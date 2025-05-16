import { useNavigate } from 'react-router-dom';

const Profile_Info = ({ userInfo }) => {
  const navigate = useNavigate();
  const fastWord = name => {
    if (!name) return '';
    const words = name.trim().split(' ');
    let initials = '';
    for (let i = 0; i < Math.min(words.length, 2); i++) {
      initials += words[i][0];
    }
    return initials.toUpperCase();
  };

  const onLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    userInfo && (
      <div className="flex items-center gap-6">
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-300 text-slate-950 font-bold text-lg">
          {fastWord(userInfo?.fullName)}
        </div>
        <div>
          <p className="text-sm font-medium">{userInfo?.fullName}</p>
          <button className="text-slate-600 hover:underline" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>
    )
  );
};

export default Profile_Info;
