import React from "react";
import ReactDOM from "react-dom/client";
import App, { loader as appLoader } from "./App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Academies, About, Contact, Dashboard, Home, Login, Profile, Register } from "./pages";
import Academy, { academyLoader, AcademyHome, JoinUs } from "./pages/Academy";
import Learn from "./pages/Learn";
import Error from "./components/Error";
import { academiesLoader } from "./pages/Academies";
// import './js/jquery-3.6.0.min.js'
function A() {
  console.log("asdfa");
  return "A";
}
function Homee() {
  return "home";
}
const router = createBrowserRouter([
  {
    element: <App />,
    loader: appLoader,
    shouldRevalidate: () => false,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "academies/",
        element: <Academies />,
        loader: academiesLoader,
      },
      {
        path: "contact/",
        element: <Contact />,
      },
      {
        path: "about/",
        element: <About />,
      },
      {
        path: "profile/",
        element: <Profile />,
      },
      {
        path: "login/",
        element: <Login />,
      },
      {
        path: "register/",
        element: <Register />,
      },
      {
        path: "academy/:academy_slug/",
        element: <Academy />,
        errorElement: <Error />,
        loader: academyLoader,
        shouldRevalidate: () => false,
        children: [
          {
            index: true,
            element: <AcademyHome />,
            shouldRevalidate: () => false,
          },
          {
            path: "joinus/",
            element: <JoinUs />,
          },
          {
            path: "learn/",
            element: <Learn />,
            children: [
              {
                path: "courses/",
                element: "courses",
              },
              {
                path: "questions/",
                element: "questions",
              },
              {
                path: "quizes/",
                element: "quizes",
              },
            ],
          },
        ],
      },
    ],
  },
]);
ReactDOM.createRoot(document.getElementById("root")).render(<RouterProvider router={router} />);
