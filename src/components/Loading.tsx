import React from 'react';
import { Loader } from '@thebeatapp/beat-ui';

import Styled from './styled';

export default () => (
  <Styled.Loading>
    <Loader useCanvas duration="750ms" />
  </Styled.Loading>
);
