import React from 'react';
import { useHistory } from 'react-router-dom';

import { usePolling } from '../../hooks';
import { apiService } from '../../data';
import Styled from './styled';
import { displayError, getPassedTime } from '../../functions';
import { handleApiResponse } from '../../data/api';
import { IDriverNotification } from './types';

type PollingData = [IDriverNotification[], unknown] | (never[] | null)[];

type NotificationMap = Map<string, IDriverNotification>;

const pollingPeriod = 30; // in secs

const Notifications: React.FC<{ uri: string }> = ({ uri }) => {
  const history = useHistory();
  const ntfRef = React.useRef<HTMLDivElement>(null);
  const ntfPaneRef = React.useRef<HTMLDivElement>(null);
  const timeout = React.useRef(-1);
  const [isVisible, setIsVisible] = React.useState(false);
  const [isSkeletonVisible, setIsSkeletonVisible] = React.useState(false);
  const [beforeTimestamp, setBeforeTimestamp] = React.useState('');
  const [hasRetrievedAll, setHasRetrievedAll] = React.useState(false);
  const [data, setData] = React.useState<NotificationMap>(new Map());
  const [pollingData, error]: PollingData = usePolling(
    () => apiService.getNotifications(),
    pollingPeriod
  );
  const [pollingLastItem] = (pollingData as IDriverNotification[]).slice(-1);

  if (error) {
    console.error('Polling:', error);
  }

  const updateImmutableData = (
    map: NotificationMap,
    array: IDriverNotification[]
  ): NotificationMap => {
    const mapClone = new Map(map);

    array.forEach((item) => {
      // eslint-disable-next-line
      const { timestamp, ['driver_shift_id']: shiftId } = item;
      const ts = new Date(timestamp).getTime();
      const uid = `${shiftId.toString(32)}.${ts.toString(32)}`;
      mapClone.set(uid, item);
    });

    return mapClone;
  };

  const getOlderNotifications: () => Promise<void> = async () =>
    handleApiResponse(
      await apiService.getNotifications(
        beforeTimestamp || pollingLastItem.timestamp,
        5
      ),
      (response) => {
        if ('data' in response) {
          // Hide loader
          setIsSkeletonVisible(false);

          // Has run out of older notifications
          if (response.data.length === 0) {
            setHasRetrievedAll(true);
            return;
          }

          const updatedData = updateImmutableData(data, response.data);
          setData(updatedData);

          // Store timestamp of the last fetched notification in queue
          if (updatedData.size) {
            const lastItem = Array.from(updatedData).pop();
            const lastNotification = lastItem?.pop() as IDriverNotification;
            if (lastNotification)
              setBeforeTimestamp(lastNotification.timestamp);
          }
        }
      },
      (error) => displayError(error.message, true)
    );

  const handleScroll: () => void = () => {
    // Halt if there are no more notifications to fetch
    if (hasRetrievedAll) return;

    window.clearTimeout(timeout.current);

    if (ntfRef.current && ntfPaneRef.current) {
      const ntfBounds = ntfRef.current.getBoundingClientRect();
      const ntfPaneBottom =
        ntfPaneRef.current.offsetTop + ntfPaneRef.current.offsetHeight;

      if (ntfBounds.top < ntfPaneBottom) {
        // Show skeleton loader
        setIsSkeletonVisible(true);

        timeout.current = window.setTimeout(() => getOlderNotifications(), 100);
      }
    }
  };

  const open = (shiftId: number) => {
    history.push(`${uri}/shift/${shiftId}`);
  };

  const hasUnreviewedNotifications = (): boolean =>
    Array.from(data).some(
      ([, i]: [string, IDriverNotification]) => i.needs_ack
    );

  let bundle = null;

  if (data.size) {
    bundle = Array.from(data).map(([, i]: [unknown, IDriverNotification]) => (
      <Styled.Notification
        ref={ntfRef}
        isUnreviewed={i.needs_ack}
        key={`ntf_${i.driver_shift_id}`}
        onClick={() => open(i.driver_shift_id)}
      >
        <Styled.NotificationSubject>
          {`${i.driver_name} ${i.driver_last_name}`.toLowerCase()}
          <Styled.NotificationSubjectExtra>
            {i.vehicle_plates}
          </Styled.NotificationSubjectExtra>
        </Styled.NotificationSubject>
        <Styled.NotificationSubjectStatus>
          <Styled.NotificationSubjectStatusText>
            {i.label?.replace(/_/g, ' ')}
          </Styled.NotificationSubjectStatusText>
          <Styled.NotificationTimeElapsed>
            {getPassedTime(i.timestamp).format()} ago
          </Styled.NotificationTimeElapsed>
        </Styled.NotificationSubjectStatus>
      </Styled.Notification>
    ));
  }

  React.useLayoutEffect(() => {
    if (pollingData) {
      const updatedData = updateImmutableData(data, pollingData);
      setData(updatedData);
    }
    // eslint-disable-next-line
  }, [pollingData]);

  return (
    <Styled.Notifications onBlur={() => setIsVisible(false)}>
      <Styled.NotificationPaneToggle
        isBulletPointVisible={hasUnreviewedNotifications()}
        onClick={() => setIsVisible(!isVisible)}
      />
      <Styled.NotificationPane
        ref={ntfPaneRef}
        onScroll={handleScroll}
        isVisible={isVisible}
      >
        <Styled.NotificationPaneHead>
          <Styled.NotificationPaneTitle count={data.size}>
            Notifications
          </Styled.NotificationPaneTitle>
        </Styled.NotificationPaneHead>
        <Styled.NotificationPaneBody>
          {bundle}
          <Styled.NotificationSkeleton isVisible={isSkeletonVisible} />
          <Styled.NotificationSkeleton isVisible={isSkeletonVisible} />
        </Styled.NotificationPaneBody>
      </Styled.NotificationPane>
    </Styled.Notifications>
  );
};

export default Notifications;
