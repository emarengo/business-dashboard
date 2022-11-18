import React from 'react';

import Styled from './styled';
import { INotification } from './types';

const Notification: React.FC<INotification> = ({
  children = null,
  message = null,
  isVisible = false,
  title = null,
  type = 'success',
  hasCloseButton = false,
  onClick,
  className
}) => (
  <Styled.Notification
    isVisible={isVisible}
    type={type}
    data-testid="notification"
    className={className}
  >
    <Styled.NotificationBody>
      {title && <Styled.NotificationTitle>{title}</Styled.NotificationTitle>}
      {(children || message) && (
        <Styled.NotificationMessage>
          {children || message}
        </Styled.NotificationMessage>
      )}
    </Styled.NotificationBody>
    {hasCloseButton && <Styled.NotificationClose onClick={onClick} />}
  </Styled.Notification>
);

export default Notification;
