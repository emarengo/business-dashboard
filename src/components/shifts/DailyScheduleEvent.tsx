import React from 'react';

import Styled from './styled';
import InfoIcon from './InfoIcon';

interface Props {
  id: string;
  offset: number;
  end: number;
  subtitle: string;
  tip: string | null;
  token: string;
  title: string;
}

const DailyScheduleEvent: React.FC<Props> = ({
  id,
  offset,
  end,
  subtitle,
  tip,
  token,
  title
}) => {
  const [activeDayEventId, setActiveDayEventId] = React.useState<string | null>(
    null
  );

  return (
    <>
      <Styled.InfoIconOverlay
        isVisible={id === activeDayEventId}
        onClick={() => setActiveDayEventId(null)}
      />
      <Styled.ScheduleEvent offset={offset} end={end}>
        <Styled.Card data-testid="day-event" isOnTop={id === activeDayEventId}>
          <Styled.CardSubtitle>
            {subtitle}
            {tip && (
              <InfoIcon
                isActive={id === activeDayEventId}
                token={token}
                onClick={() => setActiveDayEventId(id)}
                onDismiss={() => setActiveDayEventId(null)}
              >
                {tip}
              </InfoIcon>
            )}
          </Styled.CardSubtitle>
          <Styled.CardTitle>{title}</Styled.CardTitle>
        </Styled.Card>
      </Styled.ScheduleEvent>
    </>
  );
};

export default React.memo(DailyScheduleEvent);
