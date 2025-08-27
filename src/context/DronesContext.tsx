import mapboxgl, { type LngLatLike } from "mapbox-gl";
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import { io } from "socket.io-client";

const INITIAL_CENTER: number[] = [35.92291, 31.95141];
const INITIAL_ZOOM: number = 11.83;

type Drone = any;

interface DroneContextType {
  dronesList: Drone[];
  redDronesCounter: number;
  activeDrone: Drone | null;
  setActiveDrone: (drone: Drone | null) => void;
  findByRegistration: (registrationCode: string) => Drone | null;
  handleMarkerClick: (lng: number, lat: number) => void;
  mapRef: any;
  mapContainerRef: any,
}

const DroneContext = createContext<DroneContextType | undefined>(undefined);

export const useDroneContext = () => {
  const ctx = useContext(DroneContext);
  if (!ctx) throw new Error("useDroneContext must be used within DroneProvider");
  return ctx;
};

export const DroneProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  const mapRef = useRef<any>(null);
  const mapContainerRef = useRef<any>(null);
  const socketRef = useRef<any>(null);
  const dronesListRef = useRef<any[]>([]);

  const [center, setCenter] = useState<number[]>(INITIAL_CENTER);
  const [zoom, setZoom] = useState<number>(INITIAL_ZOOM);
  const [redDronesCounter, setRedDronesCounter] = useState<number>(0);
  const [activeDrone, setActiveDrone] = useState<any>(null);
  const [dronesList, setDronesList] = useState<any[]>([]);

  useEffect(() => {
    dronesListRef.current = dronesList;
  }, [dronesList]);

  useEffect(() => {
    socketRef.current = io("ws://localhost:9013");

    socketRef.current.on("connect", () => {
      console.log("Connected to WebSocket server");
    });

    socketRef.current.on("message", (data: any) => {
      const existingDrone = findByRegistration(data.features[0].properties.registration);
      if (existingDrone != null)
        addPath(data);
      else
        addPoint(data);
    });

    socketRef.current.on("disconnect", () => {
      console.warn("disconnected from server");
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    if (location.pathname === "/map") {
      mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
  
      if (mapboxgl.getRTLTextPluginStatus() === "unavailable") {
        mapboxgl.setRTLTextPlugin(
          "https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.3.0/mapbox-gl-rtl-text.js",
          null,
          true
        );
      }
  
      if (!mapRef.current && mapContainerRef.current) {
        mapRef.current = new mapboxgl.Map({
          container: mapContainerRef.current,
          center: center as LngLatLike,
          zoom: zoom,
          minZoom: 5,
          style: "mapbox://styles/mapbox/dark-v11",
        });
  
        mapRef.current.on("move", () => {
          const mapCenter = mapRef.current.getCenter();
          const mapZoom = mapRef.current.getZoom();
  
          setCenter([mapCenter.lng, mapCenter.lat]);
          setZoom(mapZoom);
        });
      }
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [location.pathname]);

  const findByRegistration = (registrationCode: string) => {
    return dronesListRef.current.find(
      (item) => item.features[0].properties.registration === registrationCode
    ) || null;
  };

  const addPoint = (data: any) => {
    const drone = {
      features: [
        data.features[0],
        {
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: [data.features[0].geometry.coordinates],
          },
          properties: {},
        },
      ],
    };

    drone.features[0].properties.timestamp = new Date();

    setDronesList((prev) => [...prev, drone]);

    const isGreen = data.features[0].properties.registration.split("-")[1][0] === "B";
    if (!isGreen) {
      setRedDronesCounter((prev) => ++prev);
    }
  };

  const addPath = (data: any) => {
    setDronesList((prev) => {
      return prev.map((item) => {
        if (item.features[0].properties.registration === data.features[0].properties.registration) {
          const timeStamp = item.features[0].properties.timestamp;
          item.features[0] = data.features[0];
          item.features[0].properties.timestamp = timeStamp;
          item.features[1].geometry.coordinates.push(data.features[0].geometry.coordinates);
        }
        return item;
      });
    });
  };

  const handleMarkerClick = useCallback((lng: number, lat: number) => {
    mapRef.current.flyTo({
      center: [lng, lat],
      zoom: 16,
    });
  }, []);

  return (
    <DroneContext.Provider
      value={{
        dronesList,
        redDronesCounter,
        activeDrone,
        setActiveDrone,
        findByRegistration,
        handleMarkerClick,
        mapRef,
        mapContainerRef,
      }}
    >
      {children}
    </DroneContext.Provider>
  );
};
