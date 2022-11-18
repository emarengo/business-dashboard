import styled from '@emotion/styled/';
import { css } from '@emotion/core';

import { Button as ButtonBase } from '@thebeatapp/beat-ui';

const EditActions = styled.div`
  display: flex;
  align-items: center;
  align-self: flex-start;
  margin-bottom: 10px;
  margin-top: -24px;
  right: -300px;
  position: absolute;
  width: 700px;
  height: 100px;
  ${({ isFiltersVisible }) =>
    isFiltersVisible &&
    css`
      -webkit-animation: slide 0.5s forwards;
      animation: slide 0.5s forwards;
    `}
`;

const ActionButton = styled(ButtonBase)`
  && {
    display: flex;
    align-items: center;
    min-width: 54px;
    width: auto;
    height: 54px;
    border-radius: 4px;
    background-color: #222a38;
    color: #fff;
    padding: 20px;
    margin: 0 5px;
    font: 14px/40px 'Jost', sans-serif;
    font-weight: 600;
  }
`;

const ActionButtonTransparent = styled(ButtonBase)`
  && {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 54px;
    width: auto;
    height: 54px;
    font: 14px/40px 'Jost', sans-serif;
    border-radius: 2px;
    background-color: rgba(255, 255, 255, 0);
    transition: background-color 0.25s ease-in-out;
    ${({ hasShadow }) =>
      hasShadow && 'box-shadow: 1px 1px 12px 0 rgba(156, 174, 194, 0.57);'}
    &:hover {
      background: rgba(255, 255, 255, 0.33) !important;
    }
    &.active {
      background: rgba(255, 255, 255, 0.33) !important;
    }
  }
`;

const GroupedActions = styled.div`
  display: flex;
  margin: 0 10px 0 5px;
  box-shadow: 1px 1px 12px 0 rgba(156, 174, 194, 0.57);
`;

export default {
  EditActions,
  ActionButton,
  ActionButtonTransparent,
  GroupedActions
};
