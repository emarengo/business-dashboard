import React from 'react';

import styled from '@emotion/styled';
import { css } from '@emotion/core';

const InitialLoaderContainer = styled.div`
  width: 100%;
  height: 100vh;
  position: absolute;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #093548;
  font-family: 'Jost', sans-serif;
  z-index: 7;
  overflow: hidden;
  background: #dde6f2;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    ${css`
      background: linear-gradient(90deg, #dde6f2, #eaf0f9, #dde6f2);
      animation: progress 2s ease-in-out infinite;
      @keyframes progress {
        0% {
          transform: translate3d(-100%, 0, 0);
        }
        100% {
          transform: translate3d(100%, 0, 0);
        }
      }
    `}
  }
`;

const LoaderText = styled.p`
  position: absolute;
  width: 412px;
  font-size: 17px;
  line-height: 1.31;
  font-weight: 400;
  text-align: center;
`;

const InitialLoaderView = ({ text }) => {
  return (
    <InitialLoaderContainer>
      <LoaderText data-testid="LoaderText">{text}</LoaderText>
    </InitialLoaderContainer>
  );
};

export default InitialLoaderView;
