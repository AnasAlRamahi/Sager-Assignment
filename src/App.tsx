import { ReactRouterAppProvider } from '@toolpad/core/react-router';
import { Outlet } from 'react-router';
import './App.css';
import { DroneProvider } from './context/DronesContext';

const NAVIGATION: any = [
  {
    segment: 'dashboard',
    title: 'Dashboard',
    icon: <img src="src\assets\icon\dashboard-svgrepo-com-2.svg" alt="Logo" />,
  },
  {
    segment: 'map',
    title: 'Map',
    icon: <img src="src\assets\icon\location-svgrepo-com-2.svg" alt="Logo" />,
  },
];

const BRANDING = {
  title: '',
  logo: <img src="src\assets\sager.svg" alt="Logo" style={{ height: 24 }} />,
  style: { backgroundColor: '#0B0B0B' },
};

function App() {
  return (
    <ReactRouterAppProvider navigation={NAVIGATION} branding={BRANDING}>
      <DroneProvider>
        <Outlet />
      </DroneProvider>
    </ReactRouterAppProvider>
  )
}

export default App
