import React from 'react';

import Styled from './styled';

import WeeklyNodes from './WeeklyNodes';
import MonthlyNodes from './MonthlyNodes';

const Timeline = ({ data, showBy, onHistoryChange }) => {
  return (
    <Styled.TimelineContainer>
      <Styled.Timeline data-testid="timeline">
        {showBy === 'week' ? (
          <WeeklyNodes handleOnClick={onHistoryChange} data={data} />
        ) : (
          <MonthlyNodes handleOnClick={onHistoryChange} data={data} />
        )}
      </Styled.Timeline>
    </Styled.TimelineContainer>
  );
};

export default Timeline;
