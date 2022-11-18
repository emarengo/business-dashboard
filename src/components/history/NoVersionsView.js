import React from 'react';

import styled from '@emotion/styled';

import { ReactComponent as NoVersionsSvg } from '../../assets/no-versions.svg';

const NoVersionsLogo = styled(NoVersionsSvg)`
  margin-bottom: 30px;
`;
const NoVersionsContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-image: linear-gradient(to bottom, #dde6f2 0%, #f2f6fa);
  color: #093548;
  font-family: 'Jost', sans-serif;
  z-index: 5;
`;

const NoVersionsTitle = styled.h1`
  font-size: 25px;
  font-weight: 800;

  margin-bottom: 36px;
`;

const NoVersionsText = styled.p`
  width: 412px;
  font-size: 17px;
  line-height: 1.31;
  font-weight: 400;
  text-align: center;
`;

const NoVersionsView = () => {
  return (
    <NoVersionsContainer>
      <NoVersionsLogo data-testid="noVersionsLogo" />
      <NoVersionsTitle data-testid="noVersionsTitle">
        No versions found
      </NoVersionsTitle>
      <NoVersionsText data-testid="noVersionsText">
        It seems that this city hasn’t any older versions or geofenced area
        hasn’t been created yet. Try another city.
      </NoVersionsText>
    </NoVersionsContainer>
  );
};

export default NoVersionsView;
