import styled from '@emotion/styled/macro';

import { base64Svg } from '../svgs';

const MapGradient = styled.div`
  width: calc(100% - 60px);
  height: 100%;
  background-image: linear-gradient(to bottom, #dde6f27d 0%, #f2f6fa00);
  position: absolute;
  z-index: 1;
  pointer-events: none;
`;

const HistoryViewButtonWrapper = styled.div`
  left: 100px;
  bottom: 50px;
  position: absolute;
  // border-radius: 8px;
  z-index: 2;
  &:hover {
    border: 0.5px solid;
    border-image-slice: 1;
    border-image-source: linear-gradient(107deg, #29d1d9 23%, #057982 88%);
  }
`;

const HistoryViewButton = styled.button`
  width: 131px;
  height: 36px;
  opacity: 1;  
  border-radius: 8px;
  backdrop-filter: blur(2px);
  box-shadow: -8px 0 16px 0 rgba(156, 156, 161, 0.11),
    8px 0 16px 0 rgba(90, 168, 202, 0.13);
  background-color: rgba(238, 240, 245, 0.45);
  border: none;
  font: 14px 'Jost', sans-serif;
  font-weight: 500;
  color: #093548;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  
  &:hover {
    --cursor-base64-url: ${base64Svg.cursor.url};
    cursor: var(--cursor-base64-url) 12 12, auto !important;
    box-shadow: 0 0 8px 3px rgba(146, 158, 170, 0.37);
    ƒ
  }
`;

export default {
  MapGradient,
  HistoryViewButton,
  HistoryViewButtonWrapper
};
