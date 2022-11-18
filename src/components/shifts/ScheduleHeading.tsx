import React, { useEffect } from 'react';
import Styled from './styled';

type Props = {
  children: string;
  parentScrollX?: number;
  onMatchCurrentTime?: (currentEl: HTMLDivElement | null) => void;
};

const ScheduleHeading = ({
  children,
  parentScrollX,
  onMatchCurrentTime
}: Props) => {
  const heading = React.useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = React.useState(false);
  const date = new Date();
  const currentHours: string = date
    .getHours()
    .toString()
    .padStart(2, '0');

  if (
    new RegExp(`^${currentHours}:`).test(children) &&
    typeof onMatchCurrentTime === 'function'
  ) {
    onMatchCurrentTime(heading.current);
  }

  useEffect(() => {
    if (parentScrollX && heading.current) {
      setIsVisible(parentScrollX <= heading.current.offsetLeft + 1);
    }
  }, [parentScrollX]);

  return (
    <Styled.ScheduleHeading
      ref={heading}
      text={children}
      isVisible={isVisible}
    />
  );
};

export default ScheduleHeading;
