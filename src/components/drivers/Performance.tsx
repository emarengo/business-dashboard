/* eslint-disable dot-notation, no-magic-numbers */
import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';

import apiService, { handleApiResponse } from 'data/api';
import { displayError, getDateString, getTimeString } from 'functions';
import PartnerStatus from 'components/drivers/PartnerStatus';
import PartnerDetails from 'components/drivers/PartnerDetails';
import Timeline from 'components/drivers/Timeline';
import KpiBox from 'components/drivers/KpiBox';
import Styled from 'components/drivers/styled';
import {
  TimelineEventGroup,
  RadialProgressStatus
} from 'components/drivers/types';
import type {
  ITimelineEventData,
  IPerformance,
  IDetails,
  IStatistics,
  IPartnerDetails,
  IKpi
} from 'components/drivers/types';

function groupEventsByRide(
  timelineEvents: ITimelineEventData[]
): TimelineEventGroup {
  return timelineEvents.reduce(
    (
      accumulator: TimelineEventGroup,
      timelineEvent: ITimelineEventData,
      index
    ) => {
      const { ride_id: rideId, ...restProps } = timelineEvent;
      const delimiter = ';';
      const groupToken = rideId ? rideId.toString() : 'NRE';
      // NRE -> Non Ride Events

      let key = `${index}${delimiter}${groupToken}`;

      // Retrieve previously set key
      const previousKey = Object.keys(accumulator).pop();

      // Set current key to previous one to group everything together
      if (key.match(groupToken) && previousKey?.match(groupToken)) {
        key = previousKey;
      }

      return {
        ...accumulator,
        [key]: accumulator[key]
          ? [...accumulator[key], { ...restProps }]
          : [{ ...restProps }]
      };
    },
    {}
  );
}

function formatShiftDate(start?: string, end?: string): string {
  if (start && end)
    return `${getDateString(start)}, ${getTimeString(start)} - ${getTimeString(
      end
    )}`;

  return '';
}

const getVotes = (votes: number): string =>
  `${votes} vote${votes > 1 ? 's' : ''}`;

const mapStats = (stats?: IStatistics | null): IKpi[] => {
  const captions = [
    'Acceptance rate',
    'Time offline',
    'Shift completion',
    'Rating'
  ];

  if (!stats)
    return captions.map((caption) => ({
      caption,
      percent: 0,
      status: RadialProgressStatus.Good
    }));

  return [
    {
      caption: captions[2],
      percent: Math.round(stats['shift_completion'] * 100),
      status: RadialProgressStatus.Good,
      measure: '%'
    },
    {
      caption: captions[1],
      percent: Math.round(
        (stats['time_offline'].value / stats['time_offline'].threshold) * 100
      ),
      value: stats['time_offline'].value,
      status:
        stats['time_offline'].value < stats['time_offline'].threshold
          ? RadialProgressStatus.Good
          : RadialProgressStatus.Bad,
      measure: `min${stats['time_offline'].value > 1 ? 's' : ''}`
    },
    {
      caption: captions[0],
      percent: 100 - Math.round(stats['cancellation_rate'].value * 100),
      status:
        100 - Math.round(stats['cancellation_rate'].value * 100) >
        100 - stats['cancellation_rate'].threshold
          ? RadialProgressStatus.Good
          : RadialProgressStatus.Bad,
      measure: '%'
    },
    {
      caption: captions[3],
      percent: Math.round((stats.rating.value / 5) * 100),
      status:
        stats.rating.value >= stats.rating.threshold
          ? RadialProgressStatus.Good
          : RadialProgressStatus.Bad,
      value: stats.rating.value,
      notice: stats.rating.votes ? getVotes(stats.rating.votes) : ''
    }
  ];
};

const useDetails = (shiftId?: string): IPartnerDetails => {
  const [details, setDetails] = useState<IDetails | null>(null);
  const [statistics, setStatistics] = useState<IStatistics | null>(null);

  useEffect(() => {
    (async () => {
      if (shiftId)
        handleApiResponse(
          await apiService.getDriverDetails(shiftId),
          (response) => {
            if ('data' in response) {
              // eslint-disable-next-line @typescript-eslint/no-shadow
              const { statistics, ...details } = response.data;

              setDetails(details);
              setStatistics(statistics);
            }
          },
          (error) => {
            displayError(`${error.name} ${error.message}`, true);
          }
        );
    })();
  }, [shiftId]);

  return { details, statistics };
};

const maxShiftEvents = 5;

type TimelineEvents = ITimelineEventData[];

const useTimelineEventGroups = (
  shiftId?: string,
  beforeTimestamp?: string
): [TimelineEventGroup, string, boolean] => {
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvents>([]);
  const [lastTimestamp, setLastTimestamp] = useState(beforeTimestamp || '');
  const [probablyHasMore, setProbablyHasMore] = useState(true);

  useEffect(() => {
    (async () => {
      if (shiftId)
        handleApiResponse(
          await apiService.getShiftEvents(
            shiftId,
            beforeTimestamp,
            maxShiftEvents
          ),
          (response) => {
            if ('data' in response && Array.isArray(response.data)) {
              setTimelineEvents([...timelineEvents, ...response.data]);

              // Update if there *might* be more shift events to fetch
              setProbablyHasMore(response.data.length === maxShiftEvents);

              // Extract timestamp from the last event in this bunch
              const [lastEvent] = response.data.slice(-1);

              if (lastEvent) setLastTimestamp(lastEvent.timestamp);

              return;
            }

            // Reset last timestamp anchor (hide 'Load More')
            setLastTimestamp('');
          },
          (error) => {
            displayError(`${error.name}: ${error.message}`, true);
          }
        );
    })();
    // eslint-disable-next-line
  }, [beforeTimestamp]);

  useEffect(() => {
    (async () => {
      if (shiftId)
        handleApiResponse(
          await apiService.getShiftEvents(shiftId),
          (response) => {
            if ('data' in response) {
              setTimelineEvents(response.data);

              // Update if there *might* be more shift events to fetch
              setProbablyHasMore(response.data.length === maxShiftEvents);

              // Extract timestamp from the last event in this bunch
              const [lastEvent] = response.data.slice(-1);

              if (lastEvent) setLastTimestamp(lastEvent.timestamp);
            }
          },
          (error) => {
            displayError(`${error.name}: ${error.message}`, true);
          }
        );
    })();
  }, [shiftId]);

  return [groupEventsByRide(timelineEvents), lastTimestamp, probablyHasMore];
};

const Performance: React.FC<IPerformance> = ({ uriBack, isCurrent }) => {
  const { id: shiftId } = useParams<{ id?: string }>();
  const [isScrolling, setIsScrolling] = useState(false);
  const [beforeTimestamp, setBeforeTimestamp] = useState('');
  const playgroundRef = useRef<HTMLDivElement>(null);
  const timelinePerformanceRef = useRef<HTMLDivElement>(null);
  const scrollingTimeout = useRef(-1);
  const { details, statistics } = useDetails(shiftId);
  const [eventGroups, nextBeforeTimestamp, probablyHasMore] =
    useTimelineEventGroups(shiftId, beforeTimestamp);
  const {
    // eslint-disable-next-line
    ['driver_shift_start']: shiftTimeStart,
    // eslint-disable-next-line
    ['driver_shift_end']: shiftTimeEnd
  } = details || {};

  const handleScroll = (): void => {
    if (!isScrolling) {
      setIsScrolling(true);
      return;
    }

    if (scrollingTimeout.current) window.clearTimeout(scrollingTimeout.current);

    scrollingTimeout.current = window.setTimeout(
      () => setIsScrolling(false),
      100
    );
  };

  return (
    <Styled.Performance>
      <Styled.PerformanceHeader>
        <Link to={uriBack}>Driver Performance</Link>
      </Styled.PerformanceHeader>
      <Styled.PerformanceBody ref={playgroundRef}>
        <PartnerStatus
          isActive={isCurrent}
          dateTime={formatShiftDate(shiftTimeStart, shiftTimeEnd)}
        />
        <PartnerDetails details={details} />
        <Styled.PerformanceTimeline
          ref={timelinePerformanceRef}
          onScroll={handleScroll}
        >
          <Styled.PerformanceTitle>Timeline</Styled.PerformanceTitle>
          <Timeline
            data={eventGroups}
            groupKeyScheme={/(.+);(.+)/}
            // As 'playground' defined the greater ancestor
            // of <Timeline> that within its space children components
            // can be placed. The main case is for the CommentBox
            // that needs to be moved vertically, along the timeline.
            playgroundElement={playgroundRef.current}
            parentElement={timelinePerformanceRef.current}
            hiddenCommentBox={isScrolling}
            hasMore={Boolean(nextBeforeTimestamp) && probablyHasMore}
            onLoadMore={() => setBeforeTimestamp(nextBeforeTimestamp)}
          />
        </Styled.PerformanceTimeline>
        <Styled.PerformanceMetrics>
          <Styled.PerformanceTitle>Statistics</Styled.PerformanceTitle>
          <KpiBox data={mapStats(statistics)} />
        </Styled.PerformanceMetrics>
      </Styled.PerformanceBody>
    </Styled.Performance>
  );
};

export default Performance;
