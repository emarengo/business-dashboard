import React from 'react';

import Styled from './styled';
import {
  formatDate,
  formatDateAsISOString,
  getDayMsecs,
  getCurrentWeek
} from '../../functions';
import { IDateRange, ITimeRange } from './types';

enum DateNavigation {
  BACK = 'previous',
  FORTH = 'next'
}

type Props = {
  mode: string;
  onChange: (date: IDateRange) => void;
};

const DateSelector = ({ mode, onChange }: Props) => {
  const [currentTimestamp, setCurrentTimestamp] = React.useState<number>(
    Date.now()
  );
  const [weekTimestamps, setWeekTimestamps] = React.useState<ITimeRange>(
    getCurrentWeek()
  );

  const changeDate = (navDir: DateNavigation) => {
    let newTimestamp = 0;

    if (navDir === DateNavigation.BACK) {
      newTimestamp = currentTimestamp - getDayMsecs();
    } else if (navDir === DateNavigation.FORTH) {
      newTimestamp = currentTimestamp + getDayMsecs();
    }

    // Update state
    setCurrentTimestamp(newTimestamp);

    // Callback
    onChange({
      start: formatDateAsISOString(newTimestamp),
      end: formatDateAsISOString(newTimestamp)
    });
  };

  const changeWeek = (navDir: DateNavigation) => {
    let _weekTimestamps: ITimeRange = { start: 0, end: 0 };

    if (navDir === DateNavigation.BACK) {
      _weekTimestamps = {
        start: weekTimestamps.start - 7 * getDayMsecs(),
        end: weekTimestamps.end - 7 * getDayMsecs()
      };
    } else if (navDir === DateNavigation.FORTH) {
      _weekTimestamps = {
        start: weekTimestamps.start + 7 * getDayMsecs(),
        end: weekTimestamps.end + 7 * getDayMsecs()
      };
    }

    // Update state
    setWeekTimestamps(_weekTimestamps);

    // Callback
    onChange({
      start: formatDateAsISOString(_weekTimestamps.start),
      end: formatDateAsISOString(_weekTimestamps.end)
    });
  };

  const handleChange = mode === 'week' ? changeWeek : changeDate;

  React.useEffect(() => {
    if (mode === 'week') {
      setWeekTimestamps(getCurrentWeek());
    } else {
      setCurrentTimestamp(Date.now());
    }
  }, [mode]);

  return (
    <Styled.DateSelector>
      <Styled.PreviousDateButton
        data-testid="button-previous-date"
        onClick={() => handleChange(DateNavigation.BACK)}
      />
      <Styled.CurrentDate>
        {formatDate(mode === 'week' ? weekTimestamps : currentTimestamp)}
      </Styled.CurrentDate>
      <Styled.NextDateButton
        data-testid="button-next-date"
        onClick={() => handleChange(DateNavigation.FORTH)}
      />
    </Styled.DateSelector>
  );
};

export default DateSelector;
