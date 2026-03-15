import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './assets/stylesheets/index.scss'

import Navbar from './components/Navbar'
import './assets/stylesheets/navbarStyles.scss'

import Login from './pages/Login'
import './assets/stylesheets/login.scss'

// Contexts
import UserDataContextProvider from './context/UserDataContext'


function App() {
  return (
    <>
      <UserDataContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={
              <Login></Login>
            }>

            </Route>
          </Routes>
        </BrowserRouter>
      </UserDataContextProvider>
    </>
  )
}

export default App
