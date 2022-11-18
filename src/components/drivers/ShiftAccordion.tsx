import React, { useState } from 'react';

import { getTimeString } from '../../functions/date';
import { IShiftAccordion } from './types';
import accordionArrow from '../svgs/accordionArrow.svg';
import Styled from './styled';

const ShiftAccordion: React.FC<IShiftAccordion> = ({
  children,
  shiftEndTime,
  shiftStartTime,
  shiftTitle
}) => {
  const [parsedStartTime, parsedEndTime, parsedNowTime] = [
    Date.parse(shiftStartTime),
    Date.parse(shiftEndTime),
    Date.now()
  ];
  const [isOpen, setIsOpen] = useState(
    parsedStartTime <= parsedNowTime && parsedNowTime <= parsedEndTime
  );

  return (
    <Styled.AccordionContainer opened={isOpen}>
      <Styled.AccordionHeader
        opened={isOpen}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Styled.Icon icon={accordionArrow} width={12} height={8} />
        <Styled.AccordionHeaderTextContainer opened={isOpen}>
          <span>{shiftTitle}: </span>
          <span>
            {getTimeString(shiftStartTime)} - {getTimeString(shiftEndTime)}
          </span>
        </Styled.AccordionHeaderTextContainer>
      </Styled.AccordionHeader>
      {isOpen && <Styled.AccordionContent>{children}</Styled.AccordionContent>}
    </Styled.AccordionContainer>
  );
};

export default ShiftAccordion;
