import styled from '@emotion/styled/macro';
import { css } from '@emotion/react';
import { Dropdown as DropdownBase, Icons, Fonts } from '@thebeatapp/beat-ui';
import { base64Svg } from '../svgs';

const startingColumnWidth = 262;

const palette = css`
  --color-orangish: #f5714c;
  --color-teal-green: #278a92;
  --color-dark: #222a38;
  --color-dark-two: #242c39;
  --color-dark-15: rgba(36, 44, 57, 0.15);
  --color-dark-navy-blue: #000028;
  --color-dark-blue-grey: #132441;
  --color-marine: #093548;
  --color-light-navy: rgba(18, 105, 143, 0.8);
  --color-light-blue-grey: #dde6f2;
  --color-pale-grey: #f2f6fa;
  --color-steel-three: #7e858f;
`;

const Shifts = styled.section<{ hasBackgroundWithGradient: boolean }>`
  ${palette};
  padding-left: 30px;
  position: relative;
  display: flex;
  flex-flow: column;
  height: 100%;
  background: ${({ hasBackgroundWithGradient }) =>
    hasBackgroundWithGradient
      ? 'linear-gradient(to bottom, var(--color-light-blue-grey), var(--color-pale-grey)) fixed'
      : 'var(--color-light-blue-grey)'};

  --cursor-base64-url: ${base64Svg.cursor.url};
`;

const Wrap = styled.div<{ height: number | null }>`
  background: inherit;
  position: relative;
  height: ${({ height }) => (height ? `${height}px` : '100%')};
`;

const Schedule = styled.div`
  background: inherit;
  position: absolute;
  left: 0;
  right: 0;
  overflow-x: auto;
  margin-top: -155px;
  padding-top: 155px;
  padding-bottom: 16px;
`;

const ScheduleTable = styled.div<{
  rows?: number;
  rowHeight?: number | string;
}>`
  display: grid;
  grid-template-rows: repeat(
    ${({ rows = 1 }) => rows},
    minmax(auto, ${({ rowHeight = 80 }) => rowHeight}px)
  );
`;

const ScheduleRow = styled.div<{ totalSlots: number }>`
  display: grid;
  grid-template-columns: ${startingColumnWidth}px repeat(
      ${({ totalSlots }) => totalSlots},
      minmax(80px, auto)
    );
  grid-template-rows: 100%;
  align-items: center;
  position: relative;
`;

const ScheduleHeading = styled.div<{ isVisible: boolean; text: string }>`
  display: flex;
  font: 10px 'Jost', sans-serif;
  height: 100%;
  align-items: flex-start;

  &:not(:first-of-type) {
    visibility: ${({ isVisible }) => (isVisible ? 'visible' : 'hidden')};
  }

  &::before {
    content: '${({ text }) => text}';
    position: absolute;
    transform: translate(-50%);
  }
`;

const ScheduleItem = styled.div<{ isHeading?: boolean }>`
  background: var(--color-light-blue-grey);
  font: 14px 'Jost', sans-serif;
  height: 100%;
  display: flex;
  align-items: center;
  padding-left: 31px;
  padding-right: 20px;
  position: sticky;
  left: 0;
  width: ${startingColumnWidth}px;
  z-index: 1;
  text-transform: capitalize;

  ${({ isHeading }) =>
    isHeading &&
    `{
    background: transparent;
    padding-left: 0;

    ${ScheduleHeading} {
      color: var(--color-dark-two);
      opacity: 0.5;
      font-size: 14px;
      padding-left: 31px;
      width: 90%;
      line-height: 1;
    }
  `}
`;

const TimeSlot = styled.div`
  border-top: solid 1px var(--color-dark-15);
  height: 100%;
`;

const ScheduleEvent = styled.div<{ offset: number; end: number }>`
  height: 100%;
  display: flex;
  align-items: center;
  position: absolute;
  left: ${({ offset }) => `${offset}px`};
  top: 0;
  width: ${({ offset, end }) => `${end - offset}px`};
  // min-width: fit-content;
`;

const Card = styled.div<{ isOnTop?: boolean }>`
  backdrop-filter: blur(4px);
  box-shadow: 6px 6px 17px 0 rgba(125, 194, 231, 0.31),
    8px 8px 14px 0 rgba(174, 174, 192, 0.45);
  background-color: rgba(241, 247, 253, 0.8);
  border-radius: 2px;
  font: 14px 'Jost', sans-serif;
  padding: 11px 16px 12px;
  height: 64px;
  width: 100%;
  white-space: nowrap;
  ${({ isOnTop }) =>
    isOnTop &&
    `
    position: relative;
    z-index: 10;
  `}
`;

const CardTitle = styled.h1`
  color: var(--color-dark);
  font-weight: 500;

  & + * {
    margin-bottom: 3px;
  }

  * + & {
    margin-top: 3px;
  }
`;

const CardSubtitle = styled.h2`
  color: var(--color-teal-green);
  display: flex;
  align-items: center;
  font-size: 12px;
  font-weight: 500;
`;

const InfoIcon = styled.div<{ isRead: boolean | undefined; isActive: boolean }>`
  background: ${base64Svg.bufferDriver.url} no-repeat;
  cursor: ${({ isRead }) =>
    typeof isRead === 'undefined' || isRead ? 'default' : 'pointer'};
  display: flex;
  height: 13px;
  width: 13px;
  margin-top: -1px;
  margin-left: 4px;
  opacity: ${({ isActive }) => (isActive ? 1 : 0.6)};
  position: relative;
  transition: 100ms;
  z-index: 1;

  &:hover {
    opacity: ${({ isActive, isRead }) => (isActive || !isRead ? 1 : 0.6)};
  }
`;

const InfoIconTooltip = styled.div<{ isVisible: boolean }>`
  align-items: flex-start;
  backdrop-filter: blur(6px);
  background-image: linear-gradient(
    to top,
    var(--color-marine),
    var(--color-dark-blue-grey)
  );
  border-radius: 4px;
  bottom: calc(100% + ${({ isVisible }) => (isVisible ? 13 : 9)}px);
  color: white;
  cursor: default;
  display: flex;
  flex-flow: column;
  font-size: 12px;
  height: 133px;
  justify-content: space-between;
  left: calc(50% - 1px);
  line-height: 1.4;
  opacity: ${({ isVisible }) => (isVisible ? 0.6 : 0)};
  padding: 16px;
  position: absolute;
  text-transform: none;
  text-align: left;
  transform: translate3d(-50%, 0, 0)
    scale3d(${({ isVisible }) => (isVisible ? '1, 1, 1' : '0, 0, 0')});
  transition: opacity 100ms linear, bottom 50ms ease;
  width: 225px;
  will-change: opacity, bottom;
  white-space: normal;

  &::after {
    content: '';
    border-top: 7px solid var(--color-marine);
    border-left: 7px solid transparent;
    border-right: 7px solid transparent;
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translate3d(-50%, 0, 0);
  }
`;

const InfoIconTooltipTitle = styled.h3`
  font-weight: 600;
  font-size: 14px;
`;

const InfoIconTooltipDismiss = styled.span`
  align-self: flex-end;
  font-weight: 600;
  text-transform: uppercase;
  text-align: right;
  cursor: pointer;
  user-select: none;

  &:active {
    position: relative;
    top: 2px;
  }
`;

const InfoIconOverlay = styled.div<{ isVisible: boolean }>`
  background: rgba(0, 31, 51, 0.25);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
  transform: scale3d(${({ isVisible }) => (isVisible ? '1, 1, 1' : '0, 0, 0')});
  transition: opacity 100ms ${({ isVisible }) => (isVisible ? 0 : 100)}ms;
  will-change: opacity, transform;
  z-index: 10;
`;

const TimeMarker = styled.div<{ height: number; position: number }>`
  background: var(--color-dark-navy-blue);
  position: absolute;
  width: 1px;
  bottom: 9px;
  height: ${({ height }) => height + 26}px;
  left: ${({ position }) => `calc(${position}px)`};
  transition: 100ms ease-in;

  &::before {
    content: '';
    width: 5px;
    height: 5px;
    background: var(--color-dark-two);
    border-radius: 50%;
    box-shadow: 2px 2px 5px 0 #aeaec0, -2px -2px 5px 0 #f0f0f3;
    position: relative;
    top: -2px;
    left: -2px;
    display: block;
    z-index: 1;
  }

  &::after {
    content: '';
    position: absolute;
    width: 9px;
    height: 9px;
    box-shadow: 2px 2px 7px 0 rgba(174, 174, 192, 0.93),
      -2px -2px 7px 0 rgba(240, 240, 243, 0.35);
    border: 1px solid #cfd1d8;
    background: #eff2f2;
    top: -4px;
    left: -4px;
    border-radius: 50%;
  }
`;

const DateSelector = styled.div`
  font: 500 20px 'Jost', sans-serif;
  text-align: center;
  user-select: none;
`;

const NavButton = styled.span`
  color: var(--color-marine);
  cursor: pointer;
  font: 9px '${Fonts.iconFont}';
  margin: 0 20px;
  padding: 6px;
  border-radius: 50%;
  transition: background 100ms linear;

  &:active {
    background: var(--color-marine);
    color: white;
  }
`;

const PreviousDateButton = styled(NavButton)`
  &::before {
    content: '${Icons.left}';
  }
`;

const NextDateButton = styled(NavButton)`
  &::before {
    content: '${Icons.right}';
  }
`;

const CurrentDate = styled.span`
  color: var(--color-dark);
  display: inline-block;
  white-space: nowrap;
  min-width: 270px;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  flex-flow: wrap;
  justify-content: space-between;
  padding: 23px 46px 21px 16px;
  position: relative;
  margin-bottom: 31px;
  z-index: 1;
`;

const ErrorPane = styled.aside<{ isVisible: boolean }>`
  backdrop-filter: blur(3px);
  box-shadow: 6px 6px 17px 0 rgba(125, 194, 231, 0.2),
    8px 8px 24px 0 rgba(174, 174, 192, 0.3);
  background: rgba(255, 255, 255, 0.75);
  border-radius: 4px;
  font-family: 'Jost', sans-serif;
  padding: 20px;
  position: absolute;
  left: 0;
  right: 30px;
  display: grid;
  grid-template-columns: 18px auto;
  grid-gap: 17px 20px;
  transition: opacity 200ms ease-in, top 200ms ease-out,
    transform 0ms ${({ isVisible }) => (isVisible ? 0 : 200)}ms;
  top: ${({ isVisible }) => (!isVisible ? 70 : 88)}px;
  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
  transform: scale(${({ isVisible }) => (isVisible ? 1 : 0)});

  &::before {
    content: ${base64Svg.error.url};
    color: var(--color-orangish);
    margin-right: 20px;
    align-self: center;
  }
`;

const ErrorHeader = styled.header``;

const ErrorTitle = styled.h1`
  color: var(--color-orangish);
  font-weight: 600;
  font-size: 16px;
  line-height: 1.4;
`;

const ErrorMessage = styled.p`
  color: var(--color-dark);
  opacity: 0.6;
  font-weight: 500;
  font-size: 14px;
  line-height: 1.6;
`;

const ErrorList = styled.ul`
  grid-column: 2;
  max-height: 320px;
  overflow: auto;
`;

const ErrorListItem = styled.li`
  color: var(--color-dark);
  font-weight: 500;
  font-size: 14px;
  line-height: 1.7;

  &:first-letter {
    text-transform: capitalize;
  }
`;

const ErrorClose = styled.span`
  position: absolute;
  top: 24px;
  right: 24px;
  cursor: pointer;

  &::after {
    content: ${base64Svg.errorClose.url};
    color: rgb(55, 55, 55);
    opacity: 0.8;
    transition: 100ms;
  }

  &:hover::after {
    opacity: 1;
  }
`;

const HeaderBlock = styled.div<{ align?: string }>`
  display: flex;
  flex-grow: 1;
  flex-basis: 50%;
  align-items: center;
  justify-content: ${({ align }) =>
    (align === 'left' && 'flex-start') ||
    (align === 'right' && 'flex-end') ||
    'center'};
`;

const HeaderBlockBottom = styled(HeaderBlock)`
  justify-content: center;
  flex-basis: 100%;
  margin-top: 32px;
`;

const HeaderTitle = styled.h1`
  font: 700 24px 'Jost', sans-serif;
  margin-right: 16px;
`;

const DayEvent = styled.div<{ isOnTop?: boolean }>`
  background: rgba(241, 247, 253, 0.8);
  border-radius: 2px;
  box-shadow: 6px 6px 17px 0 rgba(125, 194, 231, 0.31),
    8px 8px 14px 0 rgba(174, 174, 192, 0.45);
  font: 500 12px 'Jost', sans-serif;
  height: 64px;
  padding: 14px 16px 11px;
  margin-right: 7px;
  ${({ isOnTop }) =>
    isOnTop &&
    `
    position: relative;
    z-index: 10;
  `}
`;

const DayEventTitle = styled.h1`
  color: var(--color-dark);
  font: 500 12px 'Jost', sans-serif;

  & + * {
    margin-bottom: 4px;
  }

  * + & {
    margin-top: 4px;
  }
`;
const DayEventHours = styled.h2<{ isActive: boolean }>`
  color: var(
    ${({ isActive }) =>
      isActive ? '--color-teal-green' : '--color-steel-three'}
  );
  display: flex;
  align-items: center;
  font: 500 10px 'Jost', sans-serif;
`;

const WeeklyScheduleEmptyDay = styled(DayEvent)`
  background: transparent;
  box-shadow: none;
  color: transparent;
  height: 64px;
`;

const WeeklyScheduleTable = styled.div`
  margin-top: -31px;
  margin-bottom: 40px;
`;

const WeeklyScheduleColumn = styled.div`
  flex-grow: 1;
  flex-basis: calc(100% / 7 - 296px);
  padding-top: 14px;
  padding-bottom: 14px;
`;

const WeeklyScheduleRow = styled.div`
  display: flex;

  &:not(:first-of-type) ${WeeklyScheduleColumn} {
    border-top: 1px solid var(--color-dark-15);
  }
`;

const WeeklyScheduleHeading = styled.div`
  height: 48px;
  font: 300 14px/48px 'Jost', sans-serif;
  margin-right: 7px;
  text-align: center;
  text-transform: uppercase;

  b {
    font-weight: 500;
  }
`;

const WeeklyScheduleItem = styled.div`
  display: flex;
  align-items: center;
  flex-basis: 296px;
  padding: 0 16px;
  font: 14px 'Jost', sans-serif;
  text-transform: capitalize;

  ${WeeklyScheduleHeading} {
    color: var(--color-dark-two);
    font-weight: 400;
    opacity: 0.5;
    text-transform: none;
  }
`;

const FileInputButton = styled.span`
  border: solid 1px #f2f2f4;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 50%;
  box-sizing: content-box;
  box-shadow: 6px 6px 17px 0 rgba(125, 194, 231, 0.43);
  color: var(--color-dark-blue-grey);
  display: flex;
  font: 14px/40px 'Jost', sans-serif;
  width: 40px;
  height: 40px;
  padding: 4px;
  user-select: none;
  position: relative;
  transition: 100ms ease;
  cursor: var(--cursor-base64-url) 12 12, auto !important;

  &::before {
    content: '${Icons.plus}';
    background: #eff2f2;
    backdrop-filter: blur(2px);
    box-shadow: 8px 8px 14px 0 rgba(174, 174, 192, 0.57),
      inset -8px -8px 14px 0 rgba(255, 255, 255, 0.9),
      inset 8px 8px 14px 0 rgba(255, 255, 255, 0.5);
    border: solid 1px #f2f2f4;
    font-family: '${Fonts.iconFont}';
    font-size: 10px;
    width: 100%;
    border-radius: 50%;
    text-align: center;
  }

  &:active::before {
    box-shadow: none;
  }
`;

const FileInput = styled.input`
  position: absolute;
  visibility: hidden;
  width: 0;
  height: 0;
  right: 0;
`;

const Dropdown = styled(DropdownBase)`
  && {
    font: 14px 'Jost', sans-serif;
    background: transparent;
    backdrop-filter: blur(9px);
    border: solid 1px transparent;
    border-radius: 20px;
    box-shadow: none;
    height: 40px;

    &:hover {
      background: rgba(255, 255, 255, 0.45);
      border-color: #f2f2f4;
      box-shadow: 8px 6px 15px 0 rgba(144, 180, 197, 0.57),
        -2px -2px 7px 0 #f0f0f3, -8px -8px 16px 0 rgba(174, 174, 192, 0.13),
        inset 6px 6px 17px 0 rgba(175, 204, 213, 0.26),
        inset 8px 8px 14px 0 rgba(255, 255, 255, 0.28);

      .beat-ui-dropdown-option-list {
        will-change: max-height;
      }
    }

    * {
      font: 500 14px 'Jost';
      color: var(--color-marine);
    }

    .beat-ui-dropdown-option-list {
      background: rgba(232, 239, 246, 0.75);
      box-shadow: 8px 6px 15px 0 rgba(144, 180, 197, 0.57),
        -2px -2px 7px 0 #f0f0f3, -8px -8px 16px 0 rgba(174, 174, 192, 0.13),
        inset 6px 6px 17px 0 rgba(175, 204, 213, 0.26),
        inset 8px 8px 14px 0 rgba(255, 255, 255, 0.28);
      border: solid 1px #eef4fa;
      border-radius: 20px;
      margin-top: 8px;
      cursor: var(--cursor-base64-url) 12 12, auto !important;

      // Hide tic
      *::after {
        display: none;
      }

      li {
        background: transparent;
        backdrop-filter: blur(9px);
        min-height: 38px;
        padding: 0 18px;
        border: 0;
        cursor: inherit;
        margin: 0;

        & > * {
          min-width: 78px;
        }

        &:not(:first-of-type) > * {
          border-top: 1px solid #ced9e5;
          padding: 9px 0 11px;
        }

        &:hover {
          background: linear-gradient(
            to left,
            #e3eaf3,
            rgba(255, 255, 255, 0.45) 93%,
            rgba(255, 255, 255, 0.65) 48%,
            rgba(255, 255, 255, 0.45) 7%,
            rgba(255, 255, 255, 0.45) 0%
          );
          backdrop-filter: blur(2px);
        }
      }
    }

    .beat-ui-dropdown-selected {
      max-height: 38px;
      height: 100%;
      min-width: auto;
      cursor: var(--cursor-base64-url) 12 12, auto !important;

      * {
        color: var(--color-marine);
        font: 500 14px 'Jost';

        &:first-of-type {
          padding-right: 10px;
        }

        &:last-of-type {
          margin-top: 1px;
          margin-right: 0;

          &::before {
            color: var(--color-marine);
            font-size: 5px;
          }
        }
      }
    }
  }
`;

const CityDropdown = styled(Dropdown)`
  .beat-ui-dropdown-selected *:first-of-type::before {
    content: ${base64Svg.menuDownArrowSmall.url};
    margin-right: 4px;
  }
`;

const ViewModeDropdown = styled(Dropdown)`
  margin-left: 16px;
`;

const Pane = styled.div`
  position: relative;
  height: 100%;
`;

export default {
  Card,
  CardTitle,
  CardSubtitle,
  CityDropdown,
  CurrentDate,
  DateSelector,
  DayEvent,
  DayEventTitle,
  DayEventHours,
  ErrorMessage,
  ErrorPane,
  ErrorHeader,
  ErrorTitle,
  ErrorList,
  ErrorListItem,
  ErrorClose,
  FileInput,
  FileInputButton,
  Header,
  HeaderBlock,
  HeaderBlockBottom,
  HeaderTitle,
  InfoIcon,
  InfoIconOverlay,
  InfoIconTooltip,
  InfoIconTooltipTitle,
  InfoIconTooltipDismiss,
  NextDateButton,
  Pane,
  PreviousDateButton,
  Schedule,
  ScheduleTable,
  ScheduleRow,
  ScheduleHeading,
  ScheduleItem,
  Shifts,
  TimeMarker,
  TimeSlot,
  ScheduleEvent,
  ViewModeDropdown,
  Wrap,
  WeeklyScheduleTable,
  WeeklyScheduleRow,
  WeeklyScheduleItem,
  WeeklyScheduleColumn,
  WeeklyScheduleHeading,
  WeeklyScheduleEmptyDay
};
