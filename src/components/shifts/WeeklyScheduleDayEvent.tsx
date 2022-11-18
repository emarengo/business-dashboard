import React from 'react';

import Styled from './styled';
import InfoIcon from './InfoIcon';

type Props = {
  id: string;
  isCurrent: boolean;
  hours: string;
  title: string;
  tip: string | null;
  token: string;
  forceTip: boolean;
};

const WeeklyScheduleDayEvent = React.forwardRef<HTMLDivElement, Props>(
  (props, ref?) => {
    const { id, isCurrent, hours, title, tip, token, forceTip } = props;
    const [activeDayEventId, setActiveDayEventId] = React.useState(
      forceTip ? id : null
    );
    const ackToken = Boolean(localStorage.getItem(`ack_${token}`));
    const infoIcon = !ackToken && id === activeDayEventId;

    return (
      <>
        <Styled.InfoIconOverlay
          isVisible={infoIcon}
          onClick={() => setActiveDayEventId(null)}
        />
        <Styled.DayEvent
          data-testid="day-event"
          isOnTop={id === activeDayEventId}
          ref={ref}
          tabIndex={-1}
        >
          <Styled.DayEventHours isActive={isCurrent}>
            {hours}
            {tip && (
              <InfoIcon
                isActive={infoIcon}
                token={token}
                onClick={() => setActiveDayEventId(id)}
                onDismiss={() => setActiveDayEventId(null)}
              >
                {tip}
              </InfoIcon>
            )}
          </Styled.DayEventHours>
          <Styled.DayEventTitle>{title}</Styled.DayEventTitle>
        </Styled.DayEvent>
      </>
    );
  }
);

export default React.memo(WeeklyScheduleDayEvent);
