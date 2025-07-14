import { Routes, Route } from 'react-router-dom';
import Navbar from './components/NavBar';
import Welcome from './pages/auth/Welcome';
import Welcome2 from './pages/auth/Welcome2';
import Welcome3 from './pages/auth/Welcome3';
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import Home from './pages/tabs/Home'
import Rides from './pages/tabs/Rides';
import Chat from './pages/tabs/Chat';
import Profile from './pages/tabs/Profile';
import FindRide from './pages/ride/FindRide';
import BookRide from './pages/ride/BookRide';
import ConfirmRide from './pages/ride/ConfirmRide';

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/"             element={<Welcome />}   />
        <Route path="/welcome2"     element={<Welcome2 />}  />
        <Route path="/welcome3"     element={<Welcome3 />}  />
        <Route path="/signup"       element={<SignUp />}    />
        <Route path="/signin"       element={<SignIn />}    />
        <Route path="/home"         element={<Home />}      />
        <Route path="/rides"        element={<Rides />}     />
        <Route path="/chat"         element={<Chat />}      />
        <Route path="/profile"      element={<Profile />}   />
        <Route path="/find-ride"    element={<FindRide />}   />
        <Route path="/confirm-ride" element={<ConfirmRide />}   />
        <Route path="/book-ride"    element={<BookRide />}   />
      </Routes>
      <Navbar />
    </>
  );
};

export default App;
