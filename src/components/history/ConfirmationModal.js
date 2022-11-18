import React from 'react';

import Styled from './styled';

const ConfirmationModal = ({
  onClose,
  isVisible,
  onConfirm,
  overlayClass,
  text = '',
  isLoading = false
}) => {
  return (
    <Styled.Dialog
      isVisible={isVisible}
      overlayClass={overlayClass}
      onClose={onClose}
    >
      <Styled.Header>{!isLoading && 'Are you sure?'}</Styled.Header>
      <Styled.Content>{text}</Styled.Content>
      <Styled.Footer>
        {!isLoading && (
          <>
            <Styled.ConfirmButton testId="noOptionBtn" onClick={onClose}>
              NO
            </Styled.ConfirmButton>
            <Styled.ConfirmButton testId="yesOptionBtn" onClick={onConfirm}>
              YES
            </Styled.ConfirmButton>
          </>
        )}
      </Styled.Footer>
    </Styled.Dialog>
  );
};

export default ConfirmationModal;
