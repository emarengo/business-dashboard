/* eslint-disable react/no-array-index-key */
import React from 'react';

import Styled from './styled';
import WeeklyScheduleDayEvent from './WeeklyScheduleDayEvent';
import {
  getFormattedDateAndTime,
  getWeeklyScheduleDate,
  getTimePeriod
} from '../../functions';
import { IDateRange, IDriverSchedule, IShift } from './types';

const dayNames = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
];

const bufferDriversTip = `You can now distinguish the buffer drivers 
scheduled in each shift.`;

type Props = {
  schedule: IShift[];
  week: IDateRange;
};

const WeeklySchedule: React.FC<Props> = ({ schedule, week }) => {
  const bufferDrivers = React.useRef<{ count: number }>({ count: 0 });
  const shiftRef = React.useRef<HTMLElement | null>(null);

  const getScheduleRow = (): JSX.Element[] =>
    schedule.map((item: IShift) => (
      <Styled.WeeklyScheduleRow key={`s_${item.id_driver}`}>
        <Styled.WeeklyScheduleItem data-testid="day-event-item">
          {`${item.last_name} ${item.first_name}`.toLowerCase()}
        </Styled.WeeklyScheduleItem>

        {Array.from({ length: 7 }).map((_, dayIndex) => {
          // Look for a shift at current week day (slot)
          const shift: IDriverSchedule | undefined = item.driver_shifts.find(
            (_shift: IDriverSchedule) => {
              // Shift date in 'YYYY-MM-dd' format
              const [startDate, startTime] = getFormattedDateAndTime(
                _shift.start_date
              );
              // Shift date as day of month
              const shiftDate = new Date(`${startDate}:${startTime}`).getDate();
              // Current processed slot/day of month in selected week
              const weekDate = getWeeklyScheduleDate(week.start, dayIndex);

              return shiftDate === weekDate;
            }
          );

          if (shift) {
            const {
              start_date: start,
              end_date: end,
              vehicle_plates: plates,
              shift_type: shiftType
            } = shift;
            const [, startTime] = getFormattedDateAndTime(start);
            const [, endTime] = getFormattedDateAndTime(end);
            const dayEventId = `s_${item.id_driver}_d_${dayIndex}`;
            const isCurrent =
              getTimePeriod(end) !== 'past' &&
              getTimePeriod(start) !== 'future';
            const isBufferDriver = shiftType === 'buffered';
            // bufferDrivers.current.count += 1;
            // Auto-show tip only once
            const forceTip =
              isBufferDriver && ++bufferDrivers.current.count === 1;

            return (
              <Styled.WeeklyScheduleColumn key={dayEventId}>
                <WeeklyScheduleDayEvent
                  forceTip={forceTip}
                  id={dayEventId}
                  isCurrent={isCurrent}
                  hours={`${startTime} - ${endTime}`}
                  tip={isBufferDriver ? bufferDriversTip : null}
                  title={plates}
                  token={shiftType}
                  ref={(element) => {
                    if (isBufferDriver && shiftRef.current === null)
                      shiftRef.current = element;
                  }}
                />
              </Styled.WeeklyScheduleColumn>
            );
          }

          return (
            <Styled.WeeklyScheduleColumn
              key={`s_${item.id_driver}_d_${dayIndex}`}
            >
              <Styled.WeeklyScheduleEmptyDay />
            </Styled.WeeklyScheduleColumn>
          );
        })}
      </Styled.WeeklyScheduleRow>
    ));

  React.useEffect(() => {
    if (shiftRef.current) {
      const domRect = shiftRef.current.getBoundingClientRect();
      window.scroll(0, domRect.top - window.innerHeight / 2);
    }
  }, [shiftRef.current]);

  return (
    <Styled.WeeklyScheduleTable>
      <Styled.WeeklyScheduleRow>
        <Styled.WeeklyScheduleItem>
          <Styled.WeeklyScheduleHeading>Drivers</Styled.WeeklyScheduleHeading>
        </Styled.WeeklyScheduleItem>
        {dayNames.map((day, ii) => {
          return (
            <Styled.WeeklyScheduleColumn key={`d_${ii}`}>
              <Styled.WeeklyScheduleHeading>
                {day.substring(0, 3)}{' '}
                <b>
                  {getWeeklyScheduleDate(week.start, ii)
                    .toString()
                    .padStart(2, '0')}
                </b>
              </Styled.WeeklyScheduleHeading>
            </Styled.WeeklyScheduleColumn>
          );
        })}
      </Styled.WeeklyScheduleRow>
      {getScheduleRow()}
    </Styled.WeeklyScheduleTable>
  );
};

export default WeeklySchedule;
