import React from 'react';

import Styled from 'components/drivers/styled';
import { IViewHeader } from 'components/types';

const ViewHeader: React.FC<IViewHeader> = ({ children, title }) => (
  <Styled.Header>
    <Styled.HeaderTitle>{title}</Styled.HeaderTitle>
    {children}
  </Styled.Header>
);

export default ViewHeader;
