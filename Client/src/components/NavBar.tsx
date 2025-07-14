import { Link, useLocation } from 'react-router-dom';
import { icons } from '../constants';

const Navbar = () => {
  const location = useLocation();
  const isMainPage = ['/home', '/chat', '/rides', '/profile'].includes(location.pathname);

  if (!isMainPage) return null; 

  const navItems = [
    { path: '/home', icon: icons.home, title: 'Home' },
    { path: '/rides', icon: icons.list, title: 'Rides' },
    { path: '/chat', icon: icons.chat, title: 'Chat' },
    { path: '/profile', icon: icons.profile, title: 'Profile' },
  ];

  return (
    <nav className="flex justify-between items-center bg-gray-700 rounded-full p-5 mx-12 mb-4 fixed bottom-0 left-0 right-0 h-14">
        {navItems.map(({ path, icon, title }) => {
          const isActive = location.pathname === path;
          return (
            <Link key={title} to={path} className={`flex flex-col items-center transition duration-200 ${isActive ? 'bg-gray-700 rounded-full' : ''}`}>
              <div className={`flex justify-center items-center rounded-full w-10 h-10 ${isActive ? 'bg-primary-600' : 'bg-transparent'} hover:bg-gray-500`}>
                <img src={icon} alt={title} className="w-7 h-7" />
              </div>
            </Link>
          );
        })}
    </nav>
  );
};

export default Navbar;
