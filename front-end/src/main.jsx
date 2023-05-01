import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Academies, About, Contact, Dashboard, Home, Login, Profile, Register } from './pages';
import Academy from './pages/Academy';

// import './js/jquery-3.6.0.min.js'
const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: 'academies/',
        element: <Academies/>,
      },
      {
        path: 'academy/:academy_slug/',
        element: <Academy/>
      },
      {
        path: 'contact/',
        element: <Contact/>
      },
      {
        path: 'about/',
        element: <About/>
      },
      {
        path: 'profile/',
        element: <Profile />,
      },
      {
        path: 'login/',
        element: <Login />
      },
      {
        path: 'register/',
        element: <Register />,
      },
    ]
    
  }
  
])
ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router}/>
)
