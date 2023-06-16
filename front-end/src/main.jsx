import React from 'react'
import ReactDOM from 'react-dom/client'
import App, {loader as appLoader} from './App'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Academies, About, Contact, Dashboard, Home, Login, Profile, Register } from './pages';
import Academy, {academyLoader,Learn, AcademyHome, JoinUs} from './pages/Academy';
import Error from './components/Error';
import { loader as AcademiesLoader } from './pages/Academies';

const router = createBrowserRouter([
  {
    element: <App />,
    loader: appLoader,
    shouldRevalidate: ()=> false,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: 'academies/',
        element: <Academies/>,
        loader: AcademiesLoader,
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
      {
        path: 'academy/:academy_slug/',
        element: <Academy />,
        errorElement: <Error/>,
        loader: academyLoader,
        shouldRevalidate: () => false,
        children: [
          {
            index:true,
            element: <AcademyHome/>
          },
          {
            path: 'joinus/',
            element: <JoinUs/>
          },
          {
            path: 'learn/',
            element: <Learn />,
            children: [
              {
                path: 'courses/',
                element: 'courses'
              },
              {
                path: 'questions/',
                element: 'questions'
              },
              {
                path: 'quizes/',
                element: 'quizes'
              }
            ]
          }
        ]
      },
    ]
    
  }
  
])
ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router}/>
)
