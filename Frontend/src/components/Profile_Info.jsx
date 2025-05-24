import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile_Info = ({ userInfo }) => {
  const [isOpen, setOpen] = useState(false);
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
      <div className="flex  items-center gap-4 relative">
        <div
          onClick={() => setOpen(!isOpen)}
          className="w-12 h-12 flex items-center cursor-pointer justify-center rounded-full bg-cyan-300 text-slate-950 font-bold text-lg"
        >
          {fastWord(userInfo?.fullName)}
        </div>
        <div className="hidden sm:block">
          <p className="text-sm font-medium">{userInfo?.fullName}</p>
          <button className="text-slate-600 hover:underline" onClick={onLogout}>
            Logout
          </button>
        </div>
        <div className="absolute top-16 right-0 bg-slate-50 shadow-ld px-6 py-3 block sm:hidden">
          {isOpen && (
            <>
              <p className="text-sm font-medium">{userInfo?.fullName}</p>
              <button
                className="text-slate-600 hover:underline"
                onClick={onLogout}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    )
  );
};

export default Profile_Info;
