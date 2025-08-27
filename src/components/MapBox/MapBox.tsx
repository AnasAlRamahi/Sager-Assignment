import { useDroneContext } from '../../context/DronesContext';
import DronesList from './DronesList/DronesList';
import MapBoxCounter from './MapBoxCounter/MapBoxCounter';
import MapBoxMarker from './MapBoxMarker/MapBoxMarker';
import MapBoxPath from './MapBoxPath/MapBoxPath';
import MapBoxPopup from './MapBoxPopup/MapBoxPopup';

const MapBox = () => {
  const {
    dronesList,
    redDronesCounter,
    activeDrone,
    setActiveDrone,
    handleMarkerClick,
    mapRef,
    mapContainerRef,
  } = useDroneContext();

  const handleMarkerHover = (feature: any) => {
    setActiveDrone(feature);
  };

  return (
    <>
      <DronesList list={dronesList} onClick={handleMarkerClick} />
      <div id="map-container" ref={mapContainerRef} />
      {
        mapRef.current && dronesList.map((drone: any) => (
          <div key={drone.features[0].properties.registration}>
            <MapBoxMarker
              key={drone.features[0].properties.registration}
              map={mapRef.current}
              feature={drone.features[0]}
              isActive={activeDrone?.properties?.registration === drone.features[0].properties.registration}
              onHover={handleMarkerHover}
              onClick={handleMarkerClick}
            />
            <MapBoxPath
              key={drone.features[1].properties.registration}
              map={mapRef.current}
              registration={drone.features[0].properties.registration}
              feature={drone.features[1]}
              pathNum={drone.features[1].geometry.coordinates.length}
            />
          </div>
        ))
      }
      {
        mapRef.current && activeDrone && (
          <MapBoxPopup map={mapRef.current} activeFeature={activeDrone} />
        )
      }
      <MapBoxCounter number={redDronesCounter} />
    </>
  );
};

export default MapBox;