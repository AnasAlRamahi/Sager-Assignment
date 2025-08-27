import styled from "@emotion/styled";
import { Card, CardHeader, type CardHeaderProps, type CardProps } from "@mui/material";
import { SmallGreyText } from "../../shared/StyledComponents";

const CustomizedCard = styled(Card)<CardProps>(({ theme }: { theme: any }) => ({
  backgroundColor: '#111111',
  backgroundImage: 'none',
  width: '330px',
  color: '#fff',
  padding: 0,
  zIndex: 1,
  top: '69px',
  bottom: '0',
  left: '94px',

  [theme.breakpoints.down("sm")]: {
    right: '0',
    left: '0',
    bottom: '0',
    width: '100%',
    top: '300px',
  },
}));

const CustomizedCardHeader = styled(CardHeader)<CardHeaderProps>(({ theme }: { theme: any }) => ({
  color: '#fff',
  padding: '30px 20px',

  [theme.breakpoints.down("sm")]: {
    display: 'none'
  },
}));

const CardItem = styled.div(() => ({
  padding: '10px 20px',
  borderTop: '1px solid #000',
  borderBottom: '1px solid #000',

  '&:hover': { backgroundColor: '#222', cursor: 'pointer' },
}));

const CardItemsContainer = styled.div(() => ({
  height: '100%',
  paddingBottom: '120px',
}));

const DroneFlyAllowanceContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;

  &>div {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    border: 1px solid #fff;
  }
`;

const DroneFlyAllowance = styled.div`
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 1px solid #fff;
`;

const VerticalFlexContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const DronesList = ({ list, onClick }: { list: any[], onClick: Function }) => {
  return (
    <CustomizedCard sx={{ position: 'absolute' }}>
      <CustomizedCardHeader slotProps={{ title: { sx: { fontWeight: 700 } } }} title="DRONES FLYING" />
      <CardItemsContainer style={{ overflowY: 'auto', scrollbarWidth: 'none' }}>
        {list.map((drone) => (
          <CardItem key={drone?.features[0].properties.registration} onClick={() => onClick(drone?.features[0].geometry.coordinates[0], drone?.features[0].geometry.coordinates[1])}>
            <div style={{ fontSize: '16px', marginBottom: '15px' }}>
              <strong >{drone?.features[0].properties.Name}</strong>
            </div>
            <div style={{ display: 'flex' }}>
              <div style={{ width: '100%' }}>
                <table style={{ width: '100%' }}>
                  <tbody>
                    <tr>
                      <td>
                        <VerticalFlexContainer>
                          <SmallGreyText>Serial #</SmallGreyText>
                          <div>{drone?.features[0].properties.serial}</div>
                        </VerticalFlexContainer>
                      </td>
                      <td>
                        <VerticalFlexContainer>
                          <SmallGreyText>Registration #</SmallGreyText>
                          <div>{drone?.features[0].properties.registration}</div>
                        </VerticalFlexContainer>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <VerticalFlexContainer>
                          <SmallGreyText>Pilot</SmallGreyText>
                          <div>{drone?.features[0]?.properties.pilot}</div>
                        </VerticalFlexContainer>
                      </td>
                      <td>
                        <VerticalFlexContainer>
                          <SmallGreyText>Organization</SmallGreyText>
                          <div>{drone?.features[0].properties.organization}</div>
                        </VerticalFlexContainer>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <DroneFlyAllowanceContainer>
                <DroneFlyAllowance style={{ background: drone?.features[0]?.properties.registration.split('-')[1][0] === 'B' ? 'green' : 'red' }} />
              </DroneFlyAllowanceContainer>
            </div>
          </CardItem>
        ))}
      </CardItemsContainer>
    </CustomizedCard>
  );
};

export default DronesList;