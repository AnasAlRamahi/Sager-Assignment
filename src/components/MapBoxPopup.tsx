import styled from '@emotion/styled'
import mapboxgl from 'mapbox-gl'
import { useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { SmallGreyText } from './shared/StyledComponents'

const PopUpContainer = styled.div`
  background-color: #111111;
  width: 100%;
  height: 100%;
`

const PopupInfoContainer = styled.div`
  display: flex;
  gap: 20px;
  padding: 0 10px;
  color: white;
`
const PopUpRowContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

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

  function formatTimeDiff() {
    const now = new Date();
    let diff = Math.abs(now.getTime() - activeFeature.properties.timestamp.getTime());
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
        <PopUpContainer>
          <strong>{activeFeature?.properties.Name}</strong>
          <PopupInfoContainer>
            <PopUpRowContainer>
              <SmallGreyText>Altitude</SmallGreyText>
              <div>{activeFeature?.properties.altitude}m</div>
            </PopUpRowContainer>
            <PopUpRowContainer>
              <SmallGreyText>Flight Time</SmallGreyText>
              <div>{formatTimeDiff()}</div>
            </PopUpRowContainer>
          </PopupInfoContainer>
        </PopUpContainer>,
        contentRef.current
      )
    }</>
  )
}

export default MapBoxPopup