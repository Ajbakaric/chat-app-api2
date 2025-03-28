import { Link, useNavigate } from 'react-router-dom';

const NavBar = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className="bg-gray-900 text-white px-4 py-3 flex justify-between items-center">
      <div className="text-xl font-bold">
        <Link to="/chatrooms">ChatApp</Link>
      </div>

      {user ? (
        <div className="flex items-center gap-4">
          <span className="text-sm hidden sm:inline">
            Logged in as <strong>{user.email}</strong>
          </span>
          <Link to="/profile" className="text-sm bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded">
            Profile
          </Link>
          <button
            onClick={handleLogout}
            className="text-sm bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="space-x-2">
          <Link to="/login" className="text-sm hover:underline">Login</Link>
          <Link to="/signup" className="text-sm hover:underline">Sign Up</Link>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
