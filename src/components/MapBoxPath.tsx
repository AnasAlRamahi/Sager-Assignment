import { useEffect } from "react";

const MapBoxPath = ({ map, registration, feature, pathNum }: { map: any, registration: string, feature: any, pathNum: number }) => {
  const isGreen = registration.split('-')[1][0] === 'B';

  useEffect(() => {
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
          "line-color": isGreen ? 'green' : 'red',
          "line-width": 2,
          "line-opacity": 0.5,
        },
      });
    } else {
      map.getSource(registration).setData(feature);
    }
  }, [pathNum]);

  return null;
};

export default MapBoxPath;