import styled from "@emotion/styled";

const CounterContainer = styled.div`
  position: absolute;
  bottom: 20px;
  right: 20px;
  display: flex;
  gap: 6px;
  color: #3C4248;
  background-color: #D9D9D9;
  border-radius: 8px;
  padding: 8px 16px;
`

const NumberCounter = styled.div`
  border-radius: 50%;
  background-color: #1F2327;
  color: white;
  height: 24px;
  width: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const MapBoxCounter = ({ number }: { number: number }) => {
  return (
    <CounterContainer>
      <NumberCounter>
        <strong>
          {number}
        </strong>
      </NumberCounter>
      <div>Drones Flying</div>
    </CounterContainer>
  );
};

export default MapBoxCounter;