import mapboxgl from "mapbox-gl";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import DroneSvg from '../assets/Icon/drone.svg';

const STANDARD_ONCLICK_ZOOM = 16;

const MapBoxMarker = ({ map, feature, isActive, onHover }: { map: any, feature: any, isActive: boolean, onHover: Function }) => {
  const { geometry, properties } = feature;

  const markerRef = useRef<any>(null);
  const contentRef = useRef<any>(document.createElement('div'));

  const isGreen = properties.registration.split('-')[1][0] === 'B';

  useEffect(() => {
    if (!markerRef.current) {
      markerRef.current = new mapboxgl.Marker(contentRef.current, { rotation: properties.yaw * 40 % 360 })
        .setLngLat([geometry.coordinates[0], geometry.coordinates[1]])
        .addTo(map);
    } else {
      // Animate marker position
      markerRef.current.setLngLat([geometry.coordinates[0], geometry.coordinates[1]]).addTo(map);
      markerRef.current.setRotation(properties.yaw * 40 % 360);
    }
    return (() => {
      markerRef.current?.remove();
    })
  }, [geometry.coordinates, properties.yaw]);

  const handleMarkerClick = () => {
    map.flyTo({
      center: geometry.coordinates,
      zoom: STANDARD_ONCLICK_ZOOM,
    })
  }

  return (
    <>
      {
        createPortal(
          <div>
            <div onMouseEnter={() => onHover(feature)}
              onMouseLeave={() => onHover(null)} onClick={() => handleMarkerClick()}
              style={{ position: 'relative', backgroundColor: isGreen ? 'green' : 'red', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: isActive ? 'pointer' : '' }}
              id={properties.registration}>
              <img src={DroneSvg} alt="Drone" />
            </div>
            <div style={{ position: 'absolute', top: '-25px', left: '14px', right: 'auto', width: 'max-content', border: '10px solid #0000', borderBottomColor: isGreen ? 'green' : 'red' }}>
            </div>
          </div>
          , contentRef.current)
      }</>
  );
};

export default MapBoxMarker;