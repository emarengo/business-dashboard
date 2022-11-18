import React from 'react';

import Styled from './styled';
import { IConfirm } from './types';

const Confirm: React.FC<IConfirm> = ({
  children,
  isVisible,
  onConfirm,
  onCancel,
  title
}) => {
  return (
    <Styled.Modal isVisible={isVisible} onClick={onCancel}>
      <Styled.ModalBackdrop />
      <Styled.ModalPane data-testid="confirm">
        <Styled.ModalTitle>{title}</Styled.ModalTitle>
        <Styled.ModalContent>{children}</Styled.ModalContent>
        <Styled.ModalActions>
          <Styled.ModalButton onClick={onCancel}>No</Styled.ModalButton>
          <Styled.ModalButton onClick={onConfirm}>Yes</Styled.ModalButton>
        </Styled.ModalActions>
      </Styled.ModalPane>
    </Styled.Modal>
  );
};

export default Confirm;
