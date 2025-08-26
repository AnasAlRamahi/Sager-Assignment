import mapboxgl from 'mapbox-gl'
import { useEffect, useRef } from "react"
import { createPortal } from "react-dom"

const MapBoxPopup = ({ map, activeFeature }: { map: any, activeFeature: any }) => {
  const popupRef = useRef<any>(null)
  const contentRef = useRef(document.createElement("div"))

  useEffect(() => {
    if (!map) return

    popupRef.current = new mapboxgl.Popup({
      closeOnClick: false,
      offset: 25,
      closeButton: false,
    })

    return () => {
      popupRef.current.remove()
    }
  }, [])


  useEffect(() => {
    if (!activeFeature) return;

    popupRef.current
      .setLngLat(activeFeature.geometry.coordinates)
      .setHTML(contentRef.current.outerHTML)
      .addTo(map)
  }, [activeFeature])

  function formatTimeDiff(date1: any, date2: any) {
    // TODO: Replace with actual flight time calculation
    let diff = Math.abs(date2 - date1);
    let hours = Math.floor(diff / (1000 * 60 * 60));

    diff -= hours * 1000 * 60 * 60;

    let minutes = Math.floor(diff / (1000 * 60));
    diff -= minutes * 1000 * 60;

    let seconds = Math.floor(diff / 1000);

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  return (
    <>{
      createPortal(
        <div className="portal-content">
          <strong>{activeFeature?.properties.Name}</strong>
          <div style={{ display: 'flex', gap: '20px', padding: '0 10px', color: 'white' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <small style={{ color: '#CCCCCC' }}>Altitude</small>
              <div>{activeFeature?.properties.altitude}m</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <small style={{ color: '#CCCCCC' }}>Flight Time</small>
              <div>{formatTimeDiff(new Date("2025-08-26T12:30:00"), new Date("2025-08-26T13:55:45"))}</div>
            </div>
          </div>
        </div>,
        contentRef.current
      )
    }</>
  )
}

export default MapBoxPopup