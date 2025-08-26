import mapboxgl, { type LngLatLike } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import MapBoxMarker from './MapBoxMarker';
import MapBoxPath from './MapBoxPath';
import MapBoxPopup from './MapBoxPopup';

const INITIAL_CENTER: number[] = [35.92291, 31.95141];
const INITIAL_ZOOM: number = 11.83;

const MapBox = () => {
  const mapRef = useRef<any>(null);
  const mapContainerRef = useRef<any>(null);
  const socketRef = useRef<any>(null);
  const dronesListRef = useRef<any[]>([]);

  const [center, setCenter] = useState<number[]>(INITIAL_CENTER);
  const [zoom, setZoom] = useState<number>(INITIAL_ZOOM);
  const [activeDrone, setActiveDrone] = useState<any>(null);
  const [dronesList, setDronesList] = useState<any[]>([]);

  useEffect(() => {
    dronesListRef.current = dronesList;
  }, [dronesList]);

  useEffect(() => {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

    if (mapboxgl.getRTLTextPluginStatus() !== 'deferred') {
      mapboxgl.setRTLTextPlugin(
        'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.3.0/mapbox-gl-rtl-text.js',
        null,
        true
      );
    }

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: center as LngLatLike,
      zoom: zoom,
      minZoom: 5,
      style: 'mapbox://styles/mapbox/dark-v11',
    });

    mapRef.current.on('load', () => {
      socketRef.current = io('ws://localhost:9013');

      socketRef.current.on('connect', () => {
        console.log('Connected to WebSocket server');
      });

      socketRef.current.on('message', (data: any) => {
        console.log('message:', data);

        const existingDrone = findByRegistration(data.features[0].properties.registration);
        if (existingDrone != null)
          addPath(data);
        else
          addPoint(data);
      });

      socketRef.current.on("disconnect", () => {
        console.warn("disconnected from server");
      });
    });

    mapRef.current.on('move', () => {
      const mapCenter = mapRef.current.getCenter()
      const mapZoom = mapRef.current.getZoom()

      setCenter([mapCenter.lng, mapCenter.lat])
      setZoom(mapZoom)
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
      if (mapRef.current) mapRef.current.remove();
    };
  }, []);

  const findByRegistration = (registrationCode: string) => {
    return dronesListRef.current.find((item) => item.features[0].properties.registration === registrationCode) || null;
  }

  const addPoint = (data: any) => {
    const drone = {
      features: [
        data.features[0], // Drone feature
        {
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: [data.features[0].geometry.coordinates],
          },
          properties: {},
        } // Path feature
      ]
    };

    setDronesList((prev) => [...prev, drone]);
  };

  const addPath = (data: any) => {
    setDronesList((prev) => {
      return prev.map((item) => {
        if (item.features[0].properties.registration === data.features[0].properties.registration) {
          item.features[0] = data.features[0]; // Update drone feature
          // item.features[1].geometry.coordinates = [...item.features[1].geometry.coordinates, data.features[0].geometry.coordinates]; // Append new coordinate to path
          item.features[1].geometry.coordinates.push(data.features[0].geometry.coordinates); // Append new coordinate to path
        }
        return item;
      });
    });
  };

  const handleMarkerHover = (feature: any) => {
    setActiveDrone(feature);
  }

  return (
    <>
      <div className="sidebar">
        Longitude: {center[0].toFixed(4)} | Latitude: {center[1].toFixed(4)} | Zoom: {zoom.toFixed(2)}
      </div>
      <div id="map-container" ref={mapContainerRef}>
      </div>
      {
        mapRef.current && dronesList.map((drone) => (
          // features[0] is the drone feature, features[1] is the path feature (if exists)
          <div key={drone.features[0].properties.registration}>
            <MapBoxMarker key={drone.features[0].properties.registration} map={mapRef.current} feature={drone.features[0]}
              isActive={activeDrone?.properties?.registration === drone.features[0].properties.registration} onHover={handleMarkerHover} />
            <MapBoxPath key={drone.features[1].properties.registration} map={mapRef.current} registration={drone.features[0].properties.registration} feature={drone.features[1]}
              pathNum={drone.features[1].geometry.coordinates.length} />
          </div>
        ))
      }
      {
        mapRef.current && activeDrone && (
          <MapBoxPopup map={mapRef.current} activeFeature={activeDrone} />
        )
      }
    </>
  )
}

export default MapBox;