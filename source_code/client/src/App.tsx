// import { useEffect, useState } from "react";
// import { useRoutes, useLocation, Navigate } from "react-router-dom";
// import { useWebsiteData } from "./api/apiServices";
// import { getAuthenticatedUser } from "./lib/authUtils";

// import Home from "./components/Home";
// import Practice from "./components/Practice";
// import Dashboard from "./components/Dashboard";
// import Profile from "./components/Profile";
// import ProblemPage from "./components/ProblemPage";
// import TopicPage from "./components/TopicPage";
// import SolutionPage from "./components/SolutionPage";
// import AdminRoutes from "./components/AdminRoutes";

// import AdminQuestionManager from "./components/AdminQuestionManager";
// import ProtectedRoutes from "./components/ProtectedRoutes";
// import SignIn from "./components/SignIn";
// import SignUp from "./components/SignUp";
// import LandingPage from "./components/LandingPage";
// import Layout from "./components/Layout";
// import LearnPage from "./components/LearnPage";
// import AdminLayout from "./components/AdminLayout";

// function App() {
//   const [nameAndDescription, setNameAndDescription] = useState({});
//   const { data } = useWebsiteData();
//   const user = getAuthenticatedUser();
//   const location = useLocation();

//   useEffect(() => {
//     setNameAndDescription((prev) => {
//       if (prev?.name) return prev;
//       return data?.homePage;
//     });
//   }, [data?.homePage]);

//   const routes = useRoutes([
//     {
//       path: "/",
//       element: !user ? (
//         <LandingPage />
//       ) : (
//         <Navigate to={user?.role === "admin" ? "/admin/question-manager" : "/home"} replace />
//       ),
//     },
//     {
//       path: "/",
//       element: <ProtectedRoutes />,
//       children: [
//         {
//           path: "home",
//           element: <Home nameAndDescription={nameAndDescription} />,
//         },
//         {
//           path: "dashboard",
//           element: <Dashboard />,
//         },
//         {
//           path: "practice",
//           element: <Practice />,
//         },
//         {
//           path: "profile",
//           element: <Profile />,
//         },
//         {
//           path: "practice/:topicSlug/:index",
//           element: <ProblemPage />,
//         },
//         {
//           path: "learn/:topicSlug", // ✅ New route for Quick Drill
//           element: <LearnPage />,
//         },
//         // {
//         //   path: "learn/:topicSlug",
//         //   element: <TopicPage />,
//         // },
//         {
//           path: "solution/:topicSlug/:index",
//           element: <SolutionPage />,
//         },
//       ],
//     },
//     {
//       path: "/admin",
//       element: <AdminRoutes />,
//       children: [
//         {
//           path: "",
//           element: <AdminLayout />, // 👈 wrap admin pages in layout
//           children: [
           
//             {
//               path: "question-manager",
//               element: <AdminQuestionManager />,
//             },
//           ],
//         },
//       ],
//     },
//     {
//       path: "/sign-in",
//       element: <SignIn />,
//     },
//     {
//       path: "/sign-up",
//       element: <SignUp />,
//     },
//   ]);

//   return routes;
// }

// export default App;

// src/App.tsx
import React, { useEffect, useState } from 'react';
import { useRoutes, Navigate } from 'react-router-dom';
import { useWebsiteData } from './api/apiServices';
import { getAuthenticatedUser } from './lib/authUtils';

import Home from './components/Home';
import Practice from './components/Practice';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import ProblemPage from './components/ProblemPage';
import LearnPage from './components/LearnPage';
import SolutionPage from './components/SolutionPage';
import AdminRoutes from './components/AdminRoutes';
import AdminLayout from './components/AdminLayout';
import AdminQuestionManager from './components/AdminQuestionManager';
import ProtectedRoutes from './components/ProtectedRoutes';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import LandingPage from './components/LandingPage';



const App: React.FC = () => {

  const { data } = useWebsiteData();
  const user = getAuthenticatedUser();



  const routes = useRoutes([
    {
      path: '/',
      element: !user ? (
        <LandingPage />
      ) : (
        <Navigate
          to={user.role === 'admin'
            ? '/admin/question-manager'
            : '/home'}
          replace
        />
      ),
    },
    {
      path: '/',
      element: <ProtectedRoutes />,
      children: [
        {
          path: 'home',
          element: <Home />,
        },
        { path: 'dashboard', element: <Dashboard /> },
        { path: 'practice', element: <Practice /> },
        { path: 'profile', element: <Profile /> },
        {
          path: 'practice/:topicSlug/:index',
          element: <ProblemPage />,
        },
        {
          path: 'learn/:topicSlug',
          element: <LearnPage />,
        },
        {
          path: 'solution/:topicSlug/:index',
          element: <SolutionPage />,
        },
      ],
    },
    {
      path: '/admin',
      element: <AdminRoutes />,
      children: [
        {
          path: '',
          element: <AdminLayout />,
          children: [
            {
              path: 'question-manager',
              element: <AdminQuestionManager />,
            },
          ],
        },
      ],
    },
    { path: '/sign-in', element: <SignIn /> },
    { path: '/sign-up', element: <SignUp /> },
  ]);

  return routes;
};

export default App;