import styled from "@emotion/styled";

const ToolbarActionsContainer = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  gap: 10px;
  height: 40px;
`;

const StyledLink = styled.a`
  background-color: #0000;
  cursor: pointer;
  padding: 5px;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 20px;
    height: 20px;
  }
`;

const PorfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Separator = styled.div`
  height: 100%;
  width: 1px;
  background: #3C4248;
`;

const ToolbarActions = () => {
  return (
    <ToolbarActionsContainer>
      <div style={{ display: 'flex', gap: '5px' }}>
        <StyledLink onClick={() => { }}><img src="src\assets\icon\capture-svgrepo-com.svg" alt="Capture Image" /></StyledLink>
        <StyledLink onClick={() => { }}><img src="src\assets\icon\language-svgrepo-com.svg" alt="Language Selection" /></StyledLink>
        <StyledLink onClick={() => { }}><img src="src\assets\icon\bell.svg" alt="Notifications" /></StyledLink>
      </div>
      <Separator />
      <PorfileContainer>
        <div><span>Hello, </span><strong>Mohammed Omar</strong></div>
        <div style={{ paddingLeft: '4px', color: '#748AA1' }}><small>Technical Support</small></div>
      </PorfileContainer>
    </ToolbarActionsContainer>
  );
}

export default ToolbarActions;