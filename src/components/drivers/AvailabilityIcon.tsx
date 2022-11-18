import React from 'react';

import { DriverAvailability } from './types';
import Styled from './styled';

export default function ({
  availability
}: {
  availability: DriverAvailability;
}): JSX.Element {
  return (
    <Styled.AvailabilityIconContainer>
      <Styled.AvailabilityIcon availability={availability} />
    </Styled.AvailabilityIconContainer>
  );
}
