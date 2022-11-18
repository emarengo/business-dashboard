import React from 'react';

import Styled from './styled';
import { IPartnerStatus } from './types';

const PartnerStatus: React.FC<IPartnerStatus> = ({ isActive, dateTime }) => (
  <Styled.PerformancePartnerStatus isActive={isActive}>
    <Styled.PerformanceTitle>
      {isActive ? 'Current' : 'Previous'} Shift
    </Styled.PerformanceTitle>
    <Styled.PerformanceDatetime>{dateTime}</Styled.PerformanceDatetime>
  </Styled.PerformancePartnerStatus>
);

export default PartnerStatus;
