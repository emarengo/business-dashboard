import React from 'react';
import styled from '@emotion/styled/macro';

const ToolTip = styled.div`
  width: 178x;
  padding: 12px;
  border-radius: 6px;
  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);
  box-shadow: -8px 0 16px 0 rgba(156, 156, 161, 0.11);
  background-image: linear-gradient(
    74deg,
    rgba(19, 36, 65, 0.45),
    rgba(41, 104, 131, 0.45) 99%
  );
`;

const ToolTipText = styled.span`
  height: 10px;
  font-family: Jost;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: normal;
  text-align: center;
  color: #ffffff;
`;

const CustomPointTooltip = ({ text, dataTestId }) => {
  return (
    <ToolTip data-testid={dataTestId}>
      <ToolTipText>{text}</ToolTipText>
    </ToolTip>
  );
};

export default CustomPointTooltip;
