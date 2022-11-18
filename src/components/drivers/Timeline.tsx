/* eslint-disable @typescript-eslint/no-shadow */
import React from 'react';
import { useParams } from 'react-router-dom';

import TimelineEvent from 'components/drivers/TimelineEvent';
import CommentBox from 'components/drivers/CommentBox';
import apiService, { handleApiResponse } from 'data/api';
import Styled from 'components/drivers/styled';
import type {
  IComment,
  ITimelineEventData,
  ITimeline,
  TimelineEventGroup,
  ITimelineMouseEvent
} from 'components/drivers/types';

const MemoizedTimeline = React.memo<{
  children: React.ReactNode;
  hasMore: boolean;
  onLoadMore: () => void;
}>((props) => {
  return (
    <Styled.Timeline>
      {props.children}
      {props.hasMore && (
        <Styled.TimelineBottom>
          <Styled.MoreEvents onClick={props.onLoadMore}>
            Load More
          </Styled.MoreEvents>
        </Styled.TimelineBottom>
      )}
    </Styled.Timeline>
  );
});

const Timeline: React.FC<ITimeline> = ({
  data,
  parentElement,
  playgroundElement,
  hiddenCommentBox,
  groupKeyScheme,
  onLoadMore,
  hasMore
}) => {
  const { id: shiftId } = useParams<{ id?: string }>();
  const [eventGroups, setEventGroups] =
    React.useState<TimelineEventGroup>(data);
  const [selectedEventId, setSelectedEventId] = React.useState('');
  const [commentBoxInput, setCommentBoxInput] = React.useState('');
  const [commentBoxTitle, setCommentBoxTitle] = React.useState('');
  const [comments, setComments] = React.useState<IComment[]>([]);
  const [acknowldegedEvents, setAcknowledgedEvents] = React.useState(new Set());
  const [isCommentBoxVisible, setIsCommentBoxVisible] = React.useState(false);
  const [commentBoxTopPosition, setCommentBoxTopPosition] = React.useState(-1);
  const commentBoxRef = CommentBox.getRef();

  const handleTimelineMouseEvent =
    (event: ITimelineMouseEvent) => (element: HTMLElement | null) => {
      setIsCommentBoxVisible(false);

      const { id, eventId, title, comments, isAcknowledged } = event;

      // Comment box remains hidden when the same event is reselected
      if (selectedEventId === id) {
        setSelectedEventId('');
        return;
      }

      if (shiftId && !isAcknowledged && !acknowldegedEvents.has(eventId)) {
        // Notify server that this event is acknowledged by an agent
        apiService.acknowledgeShiftEvent(Number.parseInt(shiftId, 10), eventId);
        // Keep track that the event is acknowledged
        setAcknowledgedEvents(new Set([...acknowldegedEvents]).add(eventId));
      }

      // For the browse to calc the 'commentBoxRef' height
      setTimeout(() => {
        if (element && parentElement) {
          const commentBoxHeight = commentBoxRef
            ? commentBoxRef.offsetHeight
            : 0;
          const viewHeight =
            parentElement.offsetTop + parentElement.offsetHeight;
          const calcPosition = (): number =>
            element.getBoundingClientRect().top - 24;

          // [A] Edge-case scenario:
          // The comment box overlaps with the UI just above
          if (calcPosition() < parentElement.offsetTop + 50) {
            // Force scrolling to this timeline event
            parentElement.scrollTo({
              behavior: 'smooth',
              top: element.clientTop
            });

            // Small delay to make sure scrolling has been completed
            setTimeout(() => {
              setCommentBoxTopPosition(calcPosition());
            }, 250);
          }
          // [B] Edge-case scenario:
          // A part of the comment box appears off screen on bottom
          else if (calcPosition() + commentBoxHeight > viewHeight) {
            // Force positioning on bottom
            setCommentBoxTopPosition(-1);
          } else {
            setCommentBoxTopPosition(calcPosition());
          }
        }
      }, 0);

      /** @todo Replace with 'eventId' later */
      setSelectedEventId(id);

      // Update comments
      setComments(comments);

      // Update title
      setCommentBoxTitle(title);

      // Show comment box
      setTimeout(() => setIsCommentBoxVisible(true), 200);
    };

  const handleCommentBoxInput = (
    inputEvent: React.FormEvent<HTMLInputElement>
  ) => {
    setCommentBoxInput(inputEvent.currentTarget.value);
  };

  const handleCommentSave = async () => {
    const [eventId, , ii] = selectedEventId.split('|');
    const eventIndex = parseInt(ii, 10) - 1;
    const [key] = Object.keys(data);

    if (shiftId)
      handleApiResponse(
        await apiService.postComment(shiftId, eventId, commentBoxInput),
        (response) => {
          if ('data' in response) {
            const groups = { ...eventGroups };
            const comment = response.data;
            groups[key][eventIndex].comments.push(comment);

            // Add comment to selected event
            setEventGroups(groups);

            // Reset input field of comment box
            setCommentBoxInput('');
          }
        }
      );
  };

  const handleCommentBoxClose = (): void => {
    setIsCommentBoxVisible(false);
    setSelectedEventId('');
  };

  React.useEffect(() => {
    if (hiddenCommentBox && isCommentBoxVisible) {
      setSelectedEventId('');
      setIsCommentBoxVisible(false);
    }
    // eslint-disable-next-line
  }, [hiddenCommentBox]);

  React.useEffect(() => {
    setEventGroups(data);
  }, [data]);

  const memEventGroups = React.useMemo(() => {
    return Object.entries(eventGroups).map(([groupId, timelineEvents], i) => {
      const matches = groupId?.match(groupKeyScheme) || [];
      const rideId = matches?.pop() as string;

      return (
        <Styled.EventGroup key={`__grp_${groupId}`}>
          <Styled.EventGroupHead>
            {Number.isNaN(Number(rideId)) ? (
              <>
                <Styled.EventGroupTitle>Non ride events</Styled.EventGroupTitle>
              </>
            ) : (
              <>
                <Styled.EventGroupTitle>Ride:</Styled.EventGroupTitle>
                <Styled.EventLink
                  href={timelineEvents[0].ride_url}
                  target="_blank"
                >
                  {rideId}
                </Styled.EventLink>
              </>
            )}
          </Styled.EventGroupHead>
          <Styled.EventGroupBody>
            {timelineEvents.map((te: ITimelineEventData, ii) => {
              const id = `${te.id}|${i + 1}|${ii + 1}`;

              return (
                <TimelineEvent
                  key={`__evt_${id}`}
                  data={te}
                  onClick={handleTimelineMouseEvent({
                    id,
                    rideId,
                    eventId: te.id,
                    title: te.label,
                    comments: te.comments,
                    isAcknowledged: !te.needs_ack
                  })}
                  isActive={selectedEventId === id}
                  isAcknowledged={acknowldegedEvents.has(te.id) || undefined}
                />
              );
            })}
          </Styled.EventGroupBody>
        </Styled.EventGroup>
      );
    });
  }, [eventGroups]);

  return (
    <>
      <MemoizedTimeline hasMore={hasMore} onLoadMore={onLoadMore}>
        {memEventGroups}
      </MemoizedTimeline>
      <CommentBox
        title={commentBoxTitle}
        comments={comments}
        offsetTop={commentBoxTopPosition}
        playground={playgroundElement}
        inputValue={commentBoxInput}
        isVisible={isCommentBoxVisible}
        isActive={Boolean(commentBoxInput)}
        onInput={handleCommentBoxInput}
        onClose={handleCommentBoxClose}
        onSave={commentBoxInput ? handleCommentSave : undefined}
      />
    </>
  );
};

export default Timeline;
