import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';
import App from './App.tsx';
import DashboardPage from './components/DashboardPage/DashboardPage.tsx';
import MapBox from './components/MapBox/MapBox.tsx';
import './index.css';
import Layout from './layouts/Layout.tsx';

const router = createBrowserRouter([
  {
    Component: App,
    children: [
      {
        path: '/',
        Component: Layout,
        children: [
          {
            path: 'dashboard',
            Component: DashboardPage,
            errorElement: <div>There was an error loading the dashboard page</div>,
          },
          {
            path: 'map',
            Component: MapBox,
            errorElement: <div>There was an error loading the map page</div>,
          },
        ],
        errorElement: <div>There was an error loading the dashboard page</div>,
      },
    ],
    errorElement: <div>There was an error loading the dashboard page, make sure you add the map token</div>,
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
