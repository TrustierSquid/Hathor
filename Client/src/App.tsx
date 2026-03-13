import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './assets/stylesheets/index.scss'

import Navbar from './components/Navbar'
import './assets/stylesheets/navbarStyles.scss'


// Contexts
import UserDataContextProvider from './context/UserDataContext'


function App() {
  return (
    <>
      <UserDataContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={
              <Navbar/>
            }>

            </Route>
          </Routes>
        </BrowserRouter>
      </UserDataContextProvider>
    </>
  )
}

export default App
