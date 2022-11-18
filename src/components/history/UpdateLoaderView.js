import React from 'react';

import styled from '@emotion/styled';

import { ReactComponent as NoVersionsSvg } from '../../assets/combined-shape.svg';

const UpdateLogo = styled(NoVersionsSvg)`
  margin-bottom: 30px;
`;
const UpdateLoaderContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-image: linear-gradient(to bottom, #dde6f2 0%, #f2f6fa);
  color: #093548;
  font-family: 'Jost', sans-serif;
  z-index: 5;
`;

const UpdateLoaderTitle = styled.h1`
  font-size: 25px;
  font-weight: 800;
  margin-bottom: 16px;
`;

const UpdateLoaderText = styled.p`
  width: 412px;
  font-size: 17px;
  line-height: 1.31;
  font-weight: 400;
  text-align: center;
`;

const UpdateLoaderView = () => (
  <UpdateLoaderContainer>
    <UpdateLogo data-testid="UpdateLogo" />
    <UpdateLoaderTitle data-testid="UpdateLoaderTitle">
      Version still uploading…
    </UpdateLoaderTitle>
    <UpdateLoaderText data-testid="UpdateLoaderText">
      This page is inaccessible as a new version is being deployed. <br />{' '}
      Please try again in 2 minutes.
    </UpdateLoaderText>
  </UpdateLoaderContainer>
);

export default UpdateLoaderView;
