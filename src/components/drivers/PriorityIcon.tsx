import React from 'react';
import Styled from './styled';
import priorityIcon from '../svgs/priorityArrow.svg';

const PriorityIcon = () => {
  return (
    <Styled.IconContainer>
      <Styled.Icon icon={priorityIcon} width={14} height={14} />
    </Styled.IconContainer>
  );
};

export default PriorityIcon;