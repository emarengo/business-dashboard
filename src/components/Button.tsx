import React from 'react';

import { IButton } from './types';
import Styled from './styled';

const Button: React.FC<IButton> = ({
  buttonStyles = {},
  content = '',
  onClick
}) => {
  return (
    <Styled.Button type="button" onClick={onClick} {...buttonStyles}>
      {content}
    </Styled.Button>
  );
};

export default Button;
