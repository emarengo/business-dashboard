import React from 'react';

import Styled from './styled';
import { IInfoIcon } from './types';

const InfoIcon: React.FC<IInfoIcon> = ({
  children,
  token,
  isActive,
  onClick,
  onDismiss
}) => {
  // A hacky three value logic ('true', 'false' or 'undefined') is used
  // to avoid a glitch on hover that causes the cursor to change from
  // 'pointer' to 'default'
  const [isRead, setIsRead] = React.useState<boolean | undefined>(undefined);

  const getToken = (): string | null => localStorage.getItem(`ack_${token}`);
  const setToken = (): void =>
    localStorage.setItem(`ack_${token}`, String(true));

  const handleInfoIconClick = () =>
    !JSON.parse(getToken() as string) && onClick();

  const handleTipIsRead = () => setIsRead(JSON.parse(getToken() as string));
  const resetTipIsRead = () => setIsRead(undefined);

  // The challenge and the feat here is forcing all of the InfoIcon
  // components to appear inactive, after the user acknowledges they
  // read the tip, without a single re-render!
  return (
    <Styled.InfoIcon
      onClick={handleInfoIconClick}
      isActive={isActive}
      isRead={isRead}
      onMouseEnter={handleTipIsRead}
      onMouseLeave={resetTipIsRead}
    >
      <Styled.InfoIconTooltip isVisible={isActive}>
        <Styled.InfoIconTooltipTitle>
          Keep track of buffer drivers
        </Styled.InfoIconTooltipTitle>
        {children}
        <Styled.InfoIconTooltipDismiss
          onClick={(event) => {
            event.stopPropagation();
            // It is enough to see the tip once
            setToken();
            // Close
            onDismiss();
          }}
        >
          Got it
        </Styled.InfoIconTooltipDismiss>
      </Styled.InfoIconTooltip>
    </Styled.InfoIcon>
  );
};

export default InfoIcon;
