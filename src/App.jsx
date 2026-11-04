import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from "./pages/Register"
import Favorites from "./pages/Favorites"
import Help from "./pages/Help"
import NotFound from "./pages/NotFound"
import BottomNav from './components/BottomNav';
import ProtectedRoute from './components/PotectedRoute';
import Profile from './pages/Profile';
function App() {
  return (
    <>
      <div className="app-content">
        <Routes >
          <Route path="/" element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/registro' element={<Register />} />
          <Route path='/favoritos' element={<Favorites />} />
          <Route path='/ayuda' element={<Help />} />
          <Route element={<ProtectedRoute/>}>
            <Route path='/profile' element={<Profile />}/>
          </Route>
          <Route path='*' element={<NotFound />} />
        </Routes>
      </div>

      <BottomNav />
    </>

  );
}

export default App;



