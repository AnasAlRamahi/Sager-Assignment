import mapboxgl from "mapbox-gl";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import DroneSvg from '../../../assets/Icon/drone.svg';
import styled from "@emotion/styled";

const MarkerCircle = styled.div`
  position: relative;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const MarkerOrientaionArrow = styled.div`
  position: absolute;
  top: -25px;
  left: 14px;
  right: auto;
  width: max-content;
  border: 10px solid #0000;
`;

const MapBoxMarker = ({ map, feature, isActive, onHover, onClick }: { map: any, feature: any, isActive: boolean, onHover: Function, onClick: Function }) => {
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
      markerRef.current.setLngLat([geometry.coordinates[0], geometry.coordinates[1]]).addTo(map);
      markerRef.current.setRotation(properties.yaw * 40 % 360);
    }
    return (() => {
      markerRef.current?.remove();
    })
  }, [geometry.coordinates, properties.yaw]);

  return (
    <>
      {
        createPortal(
          <div>
            <MarkerCircle onMouseEnter={() => onHover(feature)}
              onMouseLeave={() => onHover(null)}
              onClick={() => onClick(geometry.coordinates[0], geometry.coordinates[1])}
              style={{ backgroundColor: isGreen ? 'green' : 'red', cursor: isActive ? 'pointer' : '' }}
              id={properties.registration}>
              <img src={DroneSvg} alt="Drone" />
            </MarkerCircle>
            <MarkerOrientaionArrow style={{ borderBottomColor: isGreen ? 'green' : 'red' }} />
          </div>
          , contentRef.current)
      }</>
  );
};

export default MapBoxMarker;