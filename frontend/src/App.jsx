
import './App.css'
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Chats from './pages/Chats';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { AppContextProvider } from './context/AppContext';
import ProtectedRoute from './components/ProtectedRoute';
function App() {
  // useEffect(
  //   server.connect(),[]
  // )

  return (
    <>
      <AppContextProvider>
        <BrowserRouter>
          <Navbar/>

          <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path="/signup" element={<Signup/>}/>
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile/>
              </ProtectedRoute>
            }/>
            <Route path="/profile/chats" element={
              <ProtectedRoute>
                <Chats/>
              </ProtectedRoute>
            }/>
          </Routes>
          <Footer/>
        </BrowserRouter>
      </AppContextProvider>
    </>
  )
}

export default App
