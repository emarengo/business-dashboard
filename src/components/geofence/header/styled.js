import styled from '@emotion/styled/macro';

import { Dropdown as DropdownBase, Fonts } from '@thebeatapp/beat-ui';

import { base64Svg } from '../../svgs';

export const CityAreaInfoWrapper = styled.div`
  margin-top: -10px;
`;

export const HeaderContainer = styled.header`
  position: absolute;
  display: flex;
  justify-content: space-between;
  width: 100%;
  top: 0;
  left: 0;
  padding: 40px 40px 0 110px;
  pointer-events: none;
  z-index: 8;
`;

export const Heading = styled.header`
  font: 24px 'Jost', sans-serif;
  font-weight: 600;
  margin-bottom: 20px;
`;

export const Title = styled.p`
  font: 24px 'Jost', sans-serif;
  font-weight: 600;
  &:first-of-type {
    margin-bottom: 20px;
  }
`;

export const NoAreasText = styled.p`
  font: 24px 'Jost', sans-serif;
  font-size: 12px;
  color: #093548;
`;

const Group = styled.div`
  display: flex;
  align-items: center;
  align-self: flex-start;
  margin-bottom: 10px;
`;

const HeaderActionsGroup = styled(Group)`
  margin-top: -18px;
  pointer-events: all;
`;

const ViewActions = styled(Group)``;

const BackButton = styled.span`
  --back-icon-base64-url: ${base64Svg.backArrow.url};
  margin-right: 8px;
  pointer-events: all;
  &::before {
    content: var(--back-icon-base64-url);
  }

  &:hover {
    cursor: pointer;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 84px;
  margin-right: -20px;
`;

const Dropdown = styled(DropdownBase)`
  && {
    --cursor-base64-url: ${base64Svg.cursor.url};
    font: 14px 'Jost', sans-serif;
    background: transparent;
    border: solid 1px transparent !important;
    border-radius: 8px;
    box-shadow: none;
    height: 40px;
    z-index: 1;

    &:hover,
    &.is-open {
      background: rgba(255, 255, 255, 0.45);
      border-radius: 8px;
      border-color: #f2f2f4;
      backdrop-filter: blur(9px);
      box-shadow: 8px 6px 15px 0 rgba(144, 180, 197, 0.57),
        -2px -2px 7px 0 #f0f0f3, -8px -8px 16px 0 rgba(174, 174, 192, 0.13),
        inset 6px 6px 17px 0 rgba(175, 204, 213, 0.26),
        inset 8px 8px 14px 0 rgba(255, 255, 255, 0.28);

      .beat-ui-dropdown-option-list {
        will-change: max-height;
      }
    }

    * {
      font: 300 14px 'Jost';
      color: #093548;
    }

    .beat-ui-dropdown-option-list {
      min-width: 167px;
      height: 200px;
      background: rgba(232, 239, 246, 0.75);
      box-shadow: 8px 6px 15px 0 rgba(144, 180, 197, 0.57),
        -8px -8px 16px 0 rgba(174, 174, 192, 0.13),
        inset 6px 6px 17px 0 rgba(175, 204, 213, 0.26),
        inset 8px 8px 14px 0 rgba(255, 255, 255, 0.28);
      border: solid 1px #eef4fa;
      border-radius: 8px;
      margin-top: 8px;
      cursor: var(--cursor-base64-url) 12 12, auto !important;

      // Custom Scrollbar
      &::-webkit-scrollbar-track {
        background-color: rgb(231, 238, 246);
        border-radius: 4px;
      }

      &::-webkit-scrollbar {
        width: 4px;
        background-color: transparent;
      }

      &::-webkit-scrollbar-thumb {
        border-radius: 4px;
        background-color: #093548;
      }

      // Hide tic
      *::after {
        display: none;
      }

      li {
        background: transparent;
        backdrop-filter: blur(9px);
        min-height: 38px;
        padding: 0 18px 0 30px;
        border: 0;
        cursor: inherit;
        margin: 0;

        &.selected > div {
          font-weight: 500;
        }

        & > * {
          min-width: 78px;
        }

        &:not(:first-of-type) > * {
          padding: 9px 0 11px;
        }

        &:hover {
          background: #093548;
          & > * {
            color: #fff;
            font-weight: 500;
          }
        }
      }
    }

    .beat-ui-dropdown-selected {
      max-height: 38px;
      height: 100%;
      min-width: auto;
      cursor: var(--cursor-base64-url) 12 12, auto !important;

      * {
        color: #093548;
        font: 500 14px 'Jost';

        &:first-of-type {
          padding-right: 10px;
        }

        &:last-of-type {
          margin-top: 1px;
          margin-right: 0;

          &::before {
            color: #093548;
            font-size: 5px;
          }
        }
      }
    }
  }
`;

// UI Components
const ExpandableButton = styled.button`
  --cursor-base64-url: ${base64Svg.cursor.url};
  border: solid 1px #f2f2f4;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 50%;
  box-sizing: content-box;
  box-shadow: 6px 6px 17px 0 rgba(125, 194, 231, 0.43);
  color: #222a38;
  display: flex;
  font: 14px/40px 'Jost', sans-serif;
  width: 40px;
  height: 40px;
  padding: 4px;
  user-select: none;
  position: relative;
  cursor: var(--cursor-base64-url) 12 12, auto !important;
  z-index: 1;
  transition: width 0.25s ease-in-out;

  &::before {
    --edit-icon-base64-url: ${base64Svg.edit.url};
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    top: -1px;
    content: var(--edit-icon-base64-url);
    background: #eff2f2;
    backdrop-filter: blur(2px);
    box-shadow: 8px 8px 14px 0 rgba(174, 174, 192, 0.57),
      inset -8px -8px 14px 0 rgba(255, 255, 255, 0.9),
      inset 8px 8px 14px 0 rgba(255, 255, 255, 0.5);
    border: solid 1px #f2f2f4;
    font-family: '${Fonts.iconFont}';
    font-size: 14px;
    width: 100%;
    border-radius: 50%;
    text-align: center;
  }

  &:active::before {
    box-shadow: none;
  }

  &:hover {
    width: 74px;
    border-radius: 24px;

    &::before {
      content: ${(props) => `'${props.label}'`};
      font: 14px 'Jost', sans-serif;
      font-weight: 500;
      height: 100%;
      top: 0;
      border-radius: 24px;
    }
  }
`;

const CityDropdown = styled(Dropdown)`
  --location-icon-base64-url: ${base64Svg.location.url};
  .beat-ui-dropdown-selected *:first-of-type::before {
    content: var(--location-icon-base64-url);
    margin-right: 4px;
  }
`;

export default {
  CityAreaInfoWrapper,
  Group,
  HeaderActionsGroup,
  ButtonWrapper,
  CityDropdown,
  HeaderContainer,
  Heading,
  Title,
  NoAreasText,
  ViewActions,
  BackButton,
  ExpandableButton
};
