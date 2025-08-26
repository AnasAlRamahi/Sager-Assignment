import './App.css';
import MapBox from './components/MapBox.tsx';
import DashboardLayout from './layouts/DashboardLayout.tsx';

function App() {
  return (
    <DashboardLayout>
      <MapBox />
    </DashboardLayout>
  )
}

export default App
