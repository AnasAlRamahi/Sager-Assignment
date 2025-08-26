import { useEffect } from "react";

const MapBoxPath = ({ map, registration, feature, pathNum }: { map: any, registration: string, feature: any, pathNum: number }) => {
  const isGreen = registration.split('-')[1][0] === 'B';

  useEffect(() => {
    console.log('patht feature', feature);
    if (!map.getSource(registration)) {
      map.addSource(registration, {
        type: "geojson",
        data: feature,
      });
      map.addLayer({
        id: registration,
        type: "line",
        source: registration,
        paint: {
          "line-color": isGreen ? 'green': 'red',
          "line-width": 4,
          "line-opacity": 0.8,
        },
      });
    } else {
      // Update path data
      map.getSource(registration).setData(feature);
    }
  }, [pathNum]);

  return null;
};

export default MapBoxPath;