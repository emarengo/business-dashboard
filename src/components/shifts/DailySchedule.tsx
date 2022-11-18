import React from 'react';

import DailyScheduleEvent from './DailyScheduleEvent';
import Styled from './styled';
import { getPastHours, getTimeString, getTotalMinutes } from '../../functions';
import ScheduleHeading from './ScheduleHeading';
import { IShift } from './types';

type Props = {
  schedule: IShift[];
};

const DailySchedule: React.FC<Props> = ({ schedule }) => {
  // State
  const [rowOffsetWidth, setRowOffsetWidth] = React.useState(0);
  const [timeMarkerHeight, setTimeMarkerHeight] = React.useState(0);
  const [scrollX, setScrollX] = React.useState(0);
  const [forceScrolling, setForceScrolling] = React.useState(true);
  const [timeMarkerPosition, setTimeMarkerPosition] = React.useState(0);

  // Refs
  const rowRef = React.useRef<HTMLDivElement>(null);
  const scheduleRef = React.useRef<HTMLDivElement>(null);
  const scheduleTableRef = React.useRef<HTMLDivElement>(null);
  const scheduleItemRef = React.useRef<HTMLDivElement>(null);
  const scrollXTimeout = React.useRef(-1);

  // Scrolling point starts after the schedule item (first column)
  const scrollOffset = scheduleItemRef.current
    ? scheduleItemRef.current.offsetWidth
    : 0;

  // A slot per hour (24h)
  const slots = Array.from({ length: 24 }).map((_, i) => i);

  const handleHorizontalScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollLeft } = event.currentTarget;

    // Prevent unnecessary updates on state
    clearTimeout(scrollXTimeout.current);

    scrollXTimeout.current = window.setTimeout(() => setScrollX(scrollLeft), 5);

    if (forceScrolling) setForceScrolling(false);
  };

  const handleMatchCurrentTime = (headingElement: HTMLDivElement | null) => {
    if (forceScrolling && scheduleRef.current)
      scheduleRef.current.scrollLeft = headingElement
        ? headingElement.offsetLeft - scrollOffset + 2
        : 0;
  };

  /**
   * @return {number} Number of pixels
   */
  const calcTimeMarkerPosition = (): number =>
    Math.round(
      (getPastHours() / 24) * (rowOffsetWidth - scrollOffset) + scrollOffset
    );

  /**
   * @param {string} timeString in a HH:MM format
   * @return {number} Number of pixels
   */
  const calcEventPosition = (timeString: string): number =>
    Math.round(
      (getTotalMinutes(timeString) / (24 * 60)) *
        (rowOffsetWidth - scrollOffset) +
        scrollOffset
    );

  const getEventPosition = (
    startTimeString: string,
    endTimeString: string
  ): number[] => {
    const startMins = getTotalMinutes(startTimeString);
    const endMins = getTotalMinutes(endTimeString);

    return [
      calcEventPosition(startTimeString),
      calcEventPosition(startMins > endMins ? '23:59' : endTimeString)
    ];
  };

  const startTimeMarker = (markerPosition: number) => {
    // Seconds left till current minute is completed
    const secsLeft = (60 - new Date().getSeconds()) * 1000;

    setTimeout(() => {
      setTimeMarkerPosition(
        timeMarkerPosition !== markerPosition
          ? markerPosition
          : markerPosition + 1
      );
    }, secsLeft);
  };

  React.useEffect(() => {
    if (rowRef.current && rowRef.current.offsetWidth)
      setRowOffsetWidth(rowRef.current.offsetWidth);
    // eslint-disable-next-line
  }, [rowRef.current]);

  React.useEffect(() => {
    if (scheduleTableRef.current) {
      setTimeMarkerHeight(scheduleTableRef.current.offsetHeight);
    }
  }, [schedule]);

  // Real time transition of time marker
  React.useEffect(() => {
    const currentTimeMarkerPosition = calcTimeMarkerPosition();

    if (timeMarkerPosition !== currentTimeMarkerPosition) {
      setTimeMarkerPosition(currentTimeMarkerPosition);
    }

    if (timeMarkerPosition > 0) {
      startTimeMarker(currentTimeMarkerPosition);
    }
    // eslint-disable-next-line
  }, [timeMarkerPosition, schedule, rowOffsetWidth]);

  return (
    <Styled.Wrap
      height={scheduleRef.current && scheduleRef.current.offsetHeight}
    >
      <Styled.Schedule ref={scheduleRef} onScroll={handleHorizontalScroll}>
        <Styled.ScheduleTable rowHeight="40">
          <Styled.ScheduleRow totalSlots={slots.length}>
            <Styled.ScheduleItem
              className="heading"
              ref={scheduleItemRef}
              isHeading
            >
              <ScheduleHeading>Drivers</ScheduleHeading>
            </Styled.ScheduleItem>
            {slots.map((slot) => {
              const hours = slot.toString().padStart(2, '0');

              return (
                <ScheduleHeading
                  key={`heading_${slot}`}
                  parentScrollX={Math.round(scrollX + scrollOffset)}
                  onMatchCurrentTime={handleMatchCurrentTime}
                >{`${hours}:00`}</ScheduleHeading>
              );
            })}
          </Styled.ScheduleRow>
        </Styled.ScheduleTable>
        <Styled.ScheduleTable ref={scheduleTableRef} rows={schedule.length}>
          {schedule.map(
            ({
              id_driver: id,
              driver_shifts: shifts,
              first_name: firstName,
              last_name: lastName
            }) => {
              const [
                {
                  start_date: startTime,
                  end_date: endTime,
                  vehicle_plates: plates,
                  shift_type: shiftType
                }
              ] = shifts;
              const offsetString = getTimeString(startTime);
              const endString = getTimeString(endTime);
              const [offset, end] = getEventPosition(offsetString, endString);
              const eventId = `s_${id}`;

              return (
                <Styled.ScheduleRow
                  key={eventId}
                  ref={rowRef}
                  totalSlots={slots.length}
                >
                  <Styled.ScheduleItem>
                    {`${lastName} ${firstName}`.toLowerCase()}
                  </Styled.ScheduleItem>
                  {slots.map((slot) => (
                    <Styled.TimeSlot key={`slot_${slot}`} />
                  ))}
                  <DailyScheduleEvent
                    id={eventId}
                    offset={offset}
                    end={end}
                    title={plates}
                    subtitle={`${offsetString} - ${endString}`}
                    tip={shiftType === 'buffered' ? bufferedDriverTip : null}
                    token={shiftType}
                  />
                </Styled.ScheduleRow>
              );
            }
          )}
        </Styled.ScheduleTable>
        {schedule.length > 0 && (
          <Styled.TimeMarker
            height={timeMarkerHeight}
            position={timeMarkerPosition}
          />
        )}
      </Styled.Schedule>
    </Styled.Wrap>
  );
};

const bufferedDriverTip = `You can now distinguish the buffer drivers 
scheduled in each shift.`;

export default DailySchedule;
