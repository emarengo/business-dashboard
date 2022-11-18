import React from 'react';
import styled from '@emotion/styled/macro';

const ToolTipWrapper = styled.div`
  position: absolute;
  z-index: 3;
  top: -50px;
`;

const ToolTipLabel = styled.div`
  flex-direction: column;
  display: flex;
  justify-content: center;
  position: absolute;
  width: 210px;
  top: -15px;
  height: 35px;
  left: 28px;
  opacity: 1;
  z-index: 2;
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
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  text-align: center;
  color: #ffffff;
`;

const ToolTipBlur = styled.div`
  width: 96px;
  height: 96px;
  -webkit-filter: blur(36px);
  filter: blur(36px);
  background-color: rgba(51, 231, 240, 0.6);
  z-index: 2;
  position: absolute;
  left: -60px;
  top: -30px;
  opacity: 1;
  pointer-events: none;
`;

export const ToolTip = () => (
  <ToolTipWrapper id="toolTip">
    <ToolTipBlur />
    <ToolTipLabel>
      <ToolTipText>Click first point to complete selection</ToolTipText>
    </ToolTipLabel>
  </ToolTipWrapper>
);
