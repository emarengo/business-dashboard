/* eslint-disable dot-notation, complexity, react/no-array-index-key */
import React from 'react';

import { IComment, ITimelineEvent } from './types';
import Styled from './styled';
import { getTimeString } from '../../functions';

function formatDescription(string: string): React.ReactNode {
  const [left, right] = string.split(':');
  return (
    <>
      {left}: <b style={{ fontWeight: '500' as 'bold' }}>{right}</b>
    </>
  );
}

const TimelineEvent: React.FC<ITimelineEvent> = ({
  data,
  isActive,
  isAcknowledged,
  onClick
}) => {
  const ref: React.RefObject<HTMLDivElement> = React.useRef(null);
  const comments = Array.isArray(data.comments) ? [...data.comments] : null;
  // Extract last comment
  const lastComment: IComment | undefined =
    comments && comments.length ? comments.pop() : undefined;
  const [htmlElement, setHtmlElement] = React.useState<HTMLElement | null>(
    null
  );

  React.useEffect(() => {
    const element = (ref ? ref.current : null) as HTMLElement;
    if (element) setHtmlElement(element);
    // eslint-disable-next-line
  }, [ref.current]);

  return (
    <Styled.Event
      key={data['id']}
      ref={ref}
      isActive={isActive}
      onClick={() => onClick(htmlElement)}
    >
      <Styled.EventLabel
        isMarked={
          isAcknowledged === undefined ? data['needs_ack'] : !isAcknowledged
        }
        isAlert={data['is_alert']}
        hasDot
      >
        {data['label']}
      </Styled.EventLabel>
      <Styled.EventTime>{getTimeString(data['timestamp'])}</Styled.EventTime>
      {Boolean(data['rating']) && (
        <Styled.EventMessage>
          {Array.from({ length: 5 }).map((_, ii) => (
            <Styled.RatingStar
              key={`__st_${ii}`}
              isActive={ii + 1 <= (data['rating'] as number)}
            />
          ))}
        </Styled.EventMessage>
      )}
      {data['reason'] && (
        <Styled.EventMessage>
          {formatDescription(`Reason: ${data['reason']}`)}
        </Styled.EventMessage>
      )}
      {data['description'] && (
        <Styled.EventMessage>
          {formatDescription(data['description'])}
        </Styled.EventMessage>
      )}
      {lastComment && (
        <Styled.EventComments total={data['comments'].length}>
          {`“${lastComment['body']}“`}
        </Styled.EventComments>
      )}
    </Styled.Event>
  );
};

export default TimelineEvent;
