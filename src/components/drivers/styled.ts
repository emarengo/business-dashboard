import { css, keyframes } from '@emotion/core';
import styled from '@emotion/styled/macro';
import { Dropdown as DropdownBase, Fonts, Icons } from '@thebeatapp/beat-ui';
import { ReactComponent as EmptyResultsSvg } from '../../assets/empty-results.svg';
import { RadialProgressStatus, DriverAvailability } from './types';
import { base64Svg } from '../svgs';

const vars = css`
  --color-dark: #222a38;
  --color-pale-grey: #f4f7f9;
  --color-pale-grey-40: rgba(238, 240, 245, 0.4);
  --color-light-grey: #eff2f2;
  --color-dark-blue-grey: #132441;
  --color-dark-blue-grey-50: rgb(19, 36, 65, 0.5);
  --color-grey-blue: #5e6b81;
  --color-tomato: #ee5a23;
  --color-dusk: #413f60;
  --color-steel: #7f899b;
  --color-steel-60: rgba(108, 122, 145, 0.6);
  --color-cornflower-blue-20: rgba(106, 167, 217, 0.2);
  --color-tealish: #23d2aa;
  --color-battleship-grey: #66667e;
  --color-marine: #093548;
  --color-very-light-pink: #fdeee9;
  --color-ice-blue: #f7fffe;
  --switch-width: 217px;
  --switch-slider-width-left: 99px;
  --switch-slider-width-right: calc(217px - 99px);
  --switch-padding: 6px;
  --cursor-base64-url: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMzRweCIgaGVpZ2h0PSIzNHB4IiB2aWV3Qm94PSIwIDAgMzQgMzQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+Y3Vyc29yPC90aXRsZT4KICAgIDxkZWZzPgogICAgICAgIDxjaXJjbGUgaWQ9InBhdGgtMSIgY3g9IjM2NSIgY3k9IjI2OCIgcj0iNiI+PC9jaXJjbGU+CiAgICAgICAgPGZpbHRlciB4PSItMTM3LjUlIiB5PSItMTM3LjUlIiB3aWR0aD0iMzc1LjAlIiBoZWlnaHQ9IjM3NS4wJSIgZmlsdGVyVW5pdHM9Im9iamVjdEJvdW5kaW5nQm94IiBpZD0iZmlsdGVyLTIiPgogICAgICAgICAgICA8ZmVNb3JwaG9sb2d5IHJhZGl1cz0iMS41IiBvcGVyYXRvcj0iZGlsYXRlIiBpbj0iU291cmNlQWxwaGEiIHJlc3VsdD0ic2hhZG93U3ByZWFkT3V0ZXIxIj48L2ZlTW9ycGhvbG9neT4KICAgICAgICAgICAgPGZlT2Zmc2V0IGR4PSIwIiBkeT0iMCIgaW49InNoYWRvd1NwcmVhZE91dGVyMSIgcmVzdWx0PSJzaGFkb3dPZmZzZXRPdXRlcjEiPjwvZmVPZmZzZXQ+CiAgICAgICAgICAgIDxmZUdhdXNzaWFuQmx1ciBzdGREZXZpYXRpb249IjQiIGluPSJzaGFkb3dPZmZzZXRPdXRlcjEiIHJlc3VsdD0ic2hhZG93Qmx1ck91dGVyMSI+PC9mZUdhdXNzaWFuQmx1cj4KICAgICAgICAgICAgPGZlQ29tcG9zaXRlIGluPSJzaGFkb3dCbHVyT3V0ZXIxIiBpbjI9IlNvdXJjZUFscGhhIiBvcGVyYXRvcj0ib3V0IiByZXN1bHQ9InNoYWRvd0JsdXJPdXRlcjEiPjwvZmVDb21wb3NpdGU+CiAgICAgICAgICAgIDxmZUNvbG9yTWF0cml4IHZhbHVlcz0iMCAwIDAgMCAwLjA3NDUwOTgwMzkgICAwIDAgMCAwIDAuMTQxMTc2NDcxICAgMCAwIDAgMCAwLjI1NDkwMTk2MSAgMCAwIDAgMC40IDAiIHR5cGU9Im1hdHJpeCIgaW49InNoYWRvd0JsdXJPdXRlcjEiPjwvZmVDb2xvck1hdHJpeD4KICAgICAgICA8L2ZpbHRlcj4KICAgIDwvZGVmcz4KICAgIDxnIGlkPSJTaGlmdC1NYW5hZ2VtZW50IiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iTmV3LWNvbXBvbmVudHMiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0zNDguMDAwMDAwLCAtMjUxLjAwMDAwMCkiPgogICAgICAgICAgICA8ZyBpZD0iY3Vyc29yIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgzNjUuMDAwMDAwLCAyNjguMDAwMDAwKSByb3RhdGUoLTM2MC4wMDAwMDApIHRyYW5zbGF0ZSgtMzY1LjAwMDAwMCwgLTI2OC4wMDAwMDApICI+CiAgICAgICAgICAgICAgICA8dXNlIGZpbGw9ImJsYWNrIiBmaWxsLW9wYWNpdHk9IjEiIGZpbHRlcj0idXJsKCNmaWx0ZXItMikiIHhsaW5rOmhyZWY9IiNwYXRoLTEiPjwvdXNlPgogICAgICAgICAgICAgICAgPHVzZSBmaWxsLW9wYWNpdHk9IjAuNTk3Njc0IiBmaWxsPSIjRkZGRkZGIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHhsaW5rOmhyZWY9IiNwYXRoLTEiPjwvdXNlPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=');
`;

const blink = keyframes`
  from {
    opacity: 0.6;
  }

  to {
    opacity: 1;
  }
`;

const View = styled.div`
  ${vars};
  font-family: 'Jost', sans-serif;
  height: 100%;
  position: relative;
`;

const Map = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
`;

const Icon = styled.div<{
  icon: string;
  width: number;
  height: number;
}>`
  background-image: url(${({ icon }) => icon});
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
`;

const AccordionContainer = styled.article<{ opened: boolean }>`
  ${({ opened }) => (opened ? 'margin-bottom: 0' : 'margin-bottom: 30px')};
  margin-left: 6px;
`;

const AccordionHeader = styled.div<{ opened: boolean }>`
  align-items: center;
  background-color: #dde6f2;
  border-bottom: 0.5px solid #929ba8;
  cursor: pointer;
  display: flex;
  padding: 10px;
  position: sticky;
  top: 0;
  z-index: 10002;
  user-select: none;
  & ${Icon} {
    will-change: transform;
    transform: ${({ opened }) => (opened ? 'rotate(0deg)' : 'rotate(180deg)')};
    transition: 0.3s;
  }
`;

const AccordionHeaderTextContainer = styled.div<{ opened: boolean }>`
  margin-left: 12px;
  & span:first-of-type {
    color: #5a6270;
    font-family: 'Jost', sans-serif;
    font-weight: 400;
    font-size: 0.875rem;
    line-height: 1.125rem;
    text-transform: uppercase;
  }
  & span:last-child {
    color: var(--color-dark-blue-grey);
    font-family: 'Jost', sans-serif;
    font-weight: ${({ opened }) => (opened ? '600' : '400')};
    font-size: 1rem;
    line-height: 1.25rem;
  }
`;

const AccordionContent = styled.div`
  padding: 0 10px 0;
`;

const Stage = styled.section<{
  isOpaque?: boolean;
}>`
  padding: 24px 0 0 24px;
  position: relative;
  background-image: linear-gradient(
    to bottom,
    #dae7f9 0%,
    rgba(226, 234, 244, 0.69) 12%,
    rgba(229, 236, 245, 0) 28%,
    rgba(242, 246, 250, 0)
  );
  background-color: ${({ isOpaque }) =>
    isOpaque ? 'rgb(221, 230, 242)' : 'transparent'};
  display: flex;
  flex-flow: column;
  overflow-y: hidden;
  height: 100vh;

  & > ${AccordionContainer}:first-of-type {
    margin-top: 30px;
  }
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  height: 46px;
  line-height: 46px;
  margin-bottom: 28px;
  padding-right: 70px;
`;

const ShiftsHeader = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-bottom: 28px;
`;

const SwitchSlider = styled.div`
  height: 34px;
  border-radius: 8px;
  backdrop-filter: blur(2px);
  box-shadow: 8px 8px 14px 0 rgba(174, 174, 192, 0.57),
    inset -8px -8px 14px 0 rgba(255, 255, 255, 0.9),
    inset 8px 8px 14px 0 rgba(255, 255, 255, 0.5);
  border: solid 1px #f2f2f4;
  background: var(--color-light-grey);
  position: absolute;
  top: 6px;
  left: 6px;
  transition: 150ms ease-in-out;
`;

const Switch = styled.div<{ labels: Array<string>; value: number }>`
  border-radius: 8px;
  box-shadow: 6px 6px 17px 0 rgba(125, 194, 231, 0.43);
  border: solid 1px #f2f2f4;
  background: rgba(255, 255, 255, 0.4);
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-shrink: 0;
  font-size: 12px;
  font-weight: 600;
  width: var(--switch-width);
  height: 48px;
  padding: var(--switch-padding);
  position: relative;
  margin-bottom: 30px;
  cursor: var(--cursor-base64-url) 12 12, auto;

  &::before {
    content: '${({ labels }) => labels.shift()}';
    color: var(
      ${({ value }) =>
        value ? '--color-battleship-grey' : '--color-dark-blue-grey'}
    );
    font-weight: 600;
    z-index: 1;
  }

  &::after {
    content: '${({ labels }) => labels.pop()}';
    color: var(
      ${({ value }) =>
        value ? '--color-dark-blue-grey' : '--color-battleship-grey'}
    );
    font-weight: 500;
    z-index: 1;
  }

  ${SwitchSlider} {
    left: ${({ value }) =>
      value
        ? 'calc(var(--switch-slider-width-left) + var(--switch-padding))'
        : 'var(--switch-padding)'};
    width: ${({ value }) =>
      value
        ? 'calc(var(--switch-slider-width-right) - 2 * var(--switch-padding) - 2px)'
        : 'var(--switch-slider-width-left)'};
  }
`;

const HeaderTitle = styled.h1`
  color: var(--color-marine);
  font-size: 24px;
  font-weight: 500;
`;

const DataTable = styled.div<{ currentShifts?: boolean }>`
  display: flex;
  font: 14px 'Jost', sans-serif;
  flex: 1;
  flex-flow: column;
  padding: 0 24px;
  margin: 0 -24px;

  ${({ currentShifts }) =>
    !currentShifts &&
    `
      overflow-x: hidden;
      overflow-y: scroll;
    `}
`;

const DataTableColumn = styled.div`
  flex: 1;
  text-overflow: ellipsis;
  white-space: nowrap;

  &:first-of-type {
    flex-grow: 0;
  }
  &:nth-of-type(2) {
    flex-basis: 20%;
    min-width: 20%;
  }
  &:nth-of-type(3) {
    flex-basis: 10%;
    min-width: 10%;
  }
  &:nth-of-type(4) {
    flex-basis: 45%;
    min-width: 45%;
  }
  &:nth-of-type(5) {
    flex-basis: 10%;
    min-width: 10%;
  }
  &:nth-of-type(6) {
    flex-basis: 15%;
    min-width: 15%;
  }
`;

const DataTableHead = styled.div<{ currentShifts?: boolean }>`
  background-color: #dde6f2;
  color: var(--color-battleship-grey);
  width: 100%;
  display: flex;
  font-size: 12px;
  padding: ${({ currentShifts }) =>
    currentShifts ? '24px 24px 6px' : '0 24px 6px'};
  position: sticky;
  top: ${({ currentShifts }) => (currentShifts ? '40.5px' : '0')};
  z-index: 10001;

  ${DataTableColumn} {
    text-transform: uppercase;
  }
`;

const DataTableBody = styled.div`
  color: var(--color-dark-blue-grey);
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  overflow: auto;
  position: relative;
  padding: 4px 18px 30px;
  margin: 0px -18px 0;
`;

const DataTableRow = styled.div<{
  index: number;
  currentShifts?: boolean;
  offlineAlert?: boolean;
}>`
  backdrop-filter: blur(3px);
  background-color: ${({ offlineAlert }) =>
    offlineAlert ? '#E2CEC7' : 'rgba(255, 255, 255, 0.4)'};
  box-shadow: 6px 6px 8px -6px rgba(125, 194, 231, 0.2),
    0px 8px 12px -6px rgba(174, 174, 192, 0.1);
  border-radius: 4px;
  display: flex;
  align-items: center;
  height: 60px;
  padding: ${({ currentShifts }) =>
    currentShifts ? '16px 24px 16px 10px' : '16px 24px'};
  position: relative;
  transition: 100ms;
  will-change: box-shadow;

  & + * {
    margin-top: 12px;
  }

  &:hover {
    box-shadow: 2px 6px 8px 0 rgba(125, 194, 231, 0.3),
      2px 8px 14px 0 rgba(174, 174, 192, 0.2);
  }
`;

const DataTableRowSkeleton = styled(DataTableRow)`
  height: 60px;
  cursor: default;
  pointer-events: none;
`;

const DataTableColumnSkeleton = styled.div`
  background: rgba(19, 36, 65, 0.1);
  border-radius: 8px;
  height: 14px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  animation: ${blink} 500ms ease-in-out infinite alternate;

  &:first-of-type {
    width: 22%;
    margin-right: 3.5%;
  }

  &:nth-of-type(2) {
    width: 22%;
    margin-right: 5.8%;
  }

  &:nth-of-type(3) {
    width: 17.3%;
    margin-right: 20%;
  }

  &:nth-of-type(4) {
    width: 3.7%;
    margin-right: 3%;
  }
`;

const DataTableNotice = styled.div<{ outsideTable?: boolean }>`
  backdrop-filter: blur(6px);
  background-color: ${({ outsideTable }) =>
    outsideTable ? '#dde6f2' : 'rgba(235, 239, 245, 0.2)'};
  color: var(--color-battleship-grey);
  padding: 24px 10px;
  position: sticky;
  top: -17px;
  z-index: 10000;
  font-weight: 400;

  b {
    font-weight: 600;
  }
`;

const InternalLink = styled.span`
  border-bottom: 1px solid;
  cursor: pointer;
  display: inline-block;
  line-height: 1;
`;

const Performance = styled.div`
  display: flex;
  flex-flow: column;
  height: 100%;
  position: relative;
  z-index: 1;
`;

const PerformanceHeader = styled.h1`
  color: var(--color-marine);
  font-size: 24px;
  font-weight: 700;

  > a {
    padding: 4px 16px 20px;
    line-height: 26px;
    display: inline-flex;
    align-items: center;

    &::before {
      content: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNSIgaGVpZ2h0PSIxMyIgdmlld0JveD0iMCAwIDE1IDEzIj4KICAgIDxwYXRoIGZpbGw9IiMwOTM1NDgiIGQ9Ik01Ljc3Ni40MjFMLjQ0MyA1LjQ3NkMuMTYgNS43NDUgMCA2LjExOSAwIDYuNTExYzAgLjM5MS4xNi43NjYuNDQzIDEuMDM0bDUuMzQ3IDUuMDdjLjU2Ny41NCAxLjQ2LjUwOCAxLjk4OC0uMDY5bC4wOTItLjExYy40MjctLjU3Mi4zNjgtMS4zODgtLjE2LTEuODlMNC45NSA3LjkzaDguNjQ3Yy43NzcgMCAxLjQwMy0uNjM3IDEuNDAzLTEuNDE4bC0uMDA2LS4xMzdjLS4wNjgtLjcxOC0uNjY2LTEuMjgyLTEuMzk3LTEuMjgySDQuOTVMNy43MSAyLjQ3NGMuMzcyLS4zMjguNTQzLS44NTMuNDM0LTEuMzU4QzguMDM0LjYxIDcuNjYxLjIwMyA3LjE2OC4wNTdjLS40OTUtLjE0Ni0xLjAzLS4wMDYtMS4zOTIuMzY0eiIvPgo8L3N2Zz4K');
      margin-right: 12px;
      margin-top: -2px;
    }
  }
`;

const PerformanceBody = styled.div`
  display: grid;
  grid-template-columns: 360px min-content;
  grid-template-rows: auto 130px 38px 1fr;
  grid-gap: 12px;
  flex: 1;
`;

const PerformancePane = styled.div`
  background: var(--color-pale-grey-40);
  backdrop-filter: blur(6px);
  border-radius: 8px;
  box-shadow: -8px 0 16px 0 rgba(156, 156, 161, 0.2),
    8px 0 16px 0 var(--color-cornflower-blue-20);
  display: flex;
  flex-wrap: wrap;
  padding: 16px 16px 24px;
  position: relative;
  z-index: 11;

  // Shift
  &:nth-of-type(1) {
    grid-column: 1;
  }

  // Driver
  &:nth-of-type(2) {
    grid-column: 1;
  }

  // Timeline
  &:nth-of-type(3) {
    grid-column: 1;
    grid-row: 3 / 5;
  }

  // Statistics
  &:nth-of-type(4) {
    grid-column: 2;
    grid-row: 2 / 4;
  }
`;

const PerformanceTitle = styled.h1`
  color: var(--color-dark-blue-grey);
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 18px;
  padding: 0 8px;
  line-height: 23px;
  flex: 1;
`;

const PerformanceTimeline = styled(PerformancePane)`
  display: block;
  overflow-y: auto;
  padding: 0;
  scroll-behavior: smooth;

  ${PerformanceTitle} {
    padding: 16px;
    position: sticky;
    top: 0;
    z-index: 1;
    backdrop-filter: blur(6px);
  }
`;

type PartnerStatusProps = {
  isActive: boolean;
};

const PerformancePartnerStatus = styled(PerformancePane)<PartnerStatusProps>`
  color: var(--color-dark-blue-grey);
  display: flex;
  flex-grow: 1;
  justify-content: space-between;
  align-items: center;
  padding: 8px 24px 7px 12px;

  & ${PerformanceTitle} {
    margin: 0;
  }

  &::before {
    border-radius: 50%;
    content: '';
    background: ${({ isActive }) =>
      `var(${isActive ? '--color-tealish' : '--color-battleship-grey'})`};
    padding: 3px;
    display: block;
  }
`;

const PerformanceDatetime = styled.div`
  font-size: 12px;
  height: 12px;

  &::before {
    content: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgdmlld0JveD0iMCAwIDEwIDEwIj4KICAgIDxwYXRoIGZpbGw9IiMxMzI0NDEiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTguNzUgOC43NWgtNy41VjQuMzc1aDcuNVY4Ljc1em0uNjI1LTcuNWgtMS4yNVYuNjI1QzguMTI1LjI1IDcuODc1IDAgNy41IDBzLS42MjUuMjUtLjYyNS42MjV2LjYyNWgtMS4yNVYuNjI1QzUuNjI1LjI1IDUuMzc1IDAgNSAwcy0uNjI1LjI1LS42MjUuNjI1di42MjVoLTEuMjVWLjYyNUMzLjEyNS4yNSAyLjg3NSAwIDIuNSAwcy0uNjI1LjI1LS42MjUuNjI1di42MjVILjYyNUMuMjUgMS4yNSAwIDEuNSAwIDEuODc1djcuNUMwIDkuNzUuMjUgMTAgLjYyNSAxMGg4Ljc1Yy4zNzUgMCAuNjI1LS4yNS42MjUtLjYyNXYtNy41YzAtLjM3NS0uMjUtLjYyNS0uNjI1LS42MjV6Ii8+Cjwvc3ZnPgo=');
    margin-right: 8px;
    vertical-align: middle;
    display: inline-block;
  }
`;

type ProgressProps = {
  size: number;
};

const Progress = styled.div<ProgressProps>`
  border-radius: 50%;
  box-shadow: 7px 7px 25px 0 rgba(125, 194, 231, 0.43), -4px -4px 11px 0 #f0f0f3;
  position: relative;
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: auto;
  padding: 1px;

  &::before {
    content: '';
    background-color: #f2f5f9;
    width: calc(100% - 1px);
    height: calc(100% - 1px);
    border-radius: inherit;
  }
`;

type ProgressLabelProps = {
  value: string | number;
  color: string;
  measure: string | null;
  status: RadialProgressStatus;
};

const ProgressLabel = styled.div<ProgressLabelProps>`
  backdrop-filter: blur(2px);
  background: var(
    ${({ status }) =>
      status === RadialProgressStatus.Bad
        ? '--color-very-light-pink'
        : '--color-ice-blue'}
  );
  border-radius: inherit;
  border: solid 1px #f2f2f4;
  box-shadow: 10px 10px 16px 0 rgba(174, 174, 192, 0.57),
    -2px -2px 8px 0 #f0f0f3, inset -10px -10px 16px 0 rgba(255, 255, 255, 0.9),
    inset 10px 10px 16px 0 rgba(255, 255, 255, 0.5);
  color: ${({ color }) => color};
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  font: 12px/1.33 'Jost', sans-serif;
  position: absolute;
  width: 66%;
  height: 66%;
  flex-flow: ${({ measure }) => (measure === '%' ? 'nowrap' : 'wrap')};
  padding: ${({ measure }) => (measure === '%' ? 0 : '9px')};

  &::before {
    content: '${({ value }) => value}';
    font-weight: 700;
    line-height: 1;
    margin: 0 1px;
  }

  &::after {
    content: '${({ measure }) => measure}';
    font-weight: 500;
    font-size: ${({ measure }) => (measure === '%' ? 12 : 10)}px;
    line-height: 1;
    width: ${({ measure }) =>
      new RegExp('min').test(measure as string) ? '100%' : 'auto'};
    text-align: center;
  }
`;

const ProgressBar = styled.canvas`
  position: absolute;
`;

const PerformanceMetrics = styled(PerformancePane)`
  padding-top: 24px;
  padding-bottom: 56px;
  height: 190px;
`;

const PerformanceKpiBox = styled.div`
  display: flex;
  flex: 1 1 100%;
  padding: 0 8px;
`;

const PerformanceKpi = styled.figure`
  position: relative;

  & + & {
    margin-left: 32px;
  }
`;

const PerformanceKpiCaption = styled.figcaption<{ notice?: string }>`
  color: var(--color-dusk);
  font-weight: 500;
  font-size: 12px;
  line-height: 14px;
  margin-top: 12px;
  text-align: center;
  white-space: nowrap;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);

  &::after {
    ${({ notice }) => notice && `content: ' (${notice})'`};
  }
`;

const OfflineTooltip = styled.span`
  backdrop-filter: blur(6px);
  background-image: linear-gradient(
    80deg,
    rgb(134, 146, 162),
    rgb(146, 172, 189) 99%
  );
  border-radius: 8px;
  box-shadow: -8px 0 16px 0 rgba(156, 156, 161, 0.11);
  color: white;
  font-size: 14px;
  font-weight: 500;
  left: 20%;
  padding: 4px 17px;
  width: auto; // Safari fix
  white-space: nowrap;
  position: absolute;
  top: -16%;
  opacity: 0;
  transform: translateX(-50%) scale(0);
  transition: opacity 200ms ease-in-out 500ms;
`;

const EventGroup = styled.div`
  color: var(--color-dark);
  font: 14px 'Jost', sans-serif;
  padding-bottom: 40px;

  &:last-of-type {
    padding-bottom: 24px;
  }
`;

const EventGroupHead = styled.header`
  padding: 0 32px;
  border-image-source: linear-gradient(
    to left,
    rgba(41, 104, 131, 0.2),
    rgba(19, 36, 65, 0.6)
  );
  border-image-slice: 1;
  border-bottom-style: solid;
  border-bottom-width: 1px;
  font-size: 12px;
  font-weight: 600;
  margin: 0 -16px;
  text-transform: uppercase;
  display: flex;
`;

const EventGroupTitle = styled.h2`
  margin-left: -8px;
  margin-right: 4px;
`;

const EventLink = styled.a<{ isDisabled?: boolean }>`
  font-weight: 500;
  margin-right: -8px;
  cursor: ${({ isDisabled }) => (!isDisabled ? 'pointer' : 'default')};
  display: inline-block;
  max-width: 100%;

  &:hover ${OfflineTooltip} {
    opacity: 0.9;
    transform: translateX(-50%) scale(1);
  }

  &::after {
    ${({ isDisabled }) => !isDisabled && "content: ''"};
    display: block;
    margin-top: -3px;
  }
`;

const EventGroupBody = styled.div`
  padding-top: 16px;
`;

const Event = styled.div<{ isActive: boolean }>`
  background: ${({ isActive }) =>
    isActive ? 'white' : 'var(--color-pale-grey)'};
  border-radius: 8px;
  box-shadow: ${({ isActive }) =>
    isActive
      ? '0 4px 12px 0 rgba(52, 105, 148, 0.4)'
      : 'inset 0 0 0 1px white'};
  display: flex;
  flex-flow: wrap;
  font: 14px 'Jost', sans-serif;
  margin-bottom: 16px;
  padding: 8px;
  transition: 100ms linear;
  cursor: pointer;

  &:last-of-type {
    margin-bottom: 0;
  }

  &:hover {
    background: white;
    box-shadow: ${({ isActive }) =>
      isActive
        ? '0 4px 12px 0 rgba(52, 105, 148, 0.4);'
        : '0 4px 8px 0 var(--color-cornflower-blue-20)'};
    transition-timing-function: ease-in-out;
  }

  &:active {
    box-shadow: 0 4px 12px 0 rgba(52, 105, 148, 0.4);
  }
`;

const EventLabel = styled.div<{
  isMarked?: boolean;
  hasDot?: boolean;
  isAlert?: boolean;
}>`
  border-radius: 8px;
  background: white
    ${({ isMarked }) =>
      isMarked ? 'linear-gradient(to left, #f38258, #ee5a23)' : 'none'};
  box-shadow: 0 2px 6px 0 rgba(156, 174, 194, 0.4);
  color: ${({ isMarked }) => (isMarked ? 'white' : 'var(--color-dark)')};
  font-weight: 600;
  padding: 4px 8px;
  position: relative;
  display: inline-flex;
  flex-flow: row-reverse;
  align-items: center;
  text-transform: capitalize;
  height: 28px;

  &::before {
    background: tomato;
    border-radius: 50%;
    ${({ isMarked, hasDot }) => isMarked && hasDot && `content: ''`};
    position: absolute;
    left: -18px;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 4px;
  }

  &::after {
    ${({ isMarked, isAlert }) =>
      (isMarked &&
        `content: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMiIgaGVpZ2h0PSIxMiIgdmlld0JveD0iMCAwIDEyIDEyIj4KICAgIDxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgZmlsbD0iI0ZGRiIgZmlsbC1ydWxlPSJub256ZXJvIj4KICAgICAgICAgICAgPGc+CiAgICAgICAgICAgICAgICA8Zz4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTQuNzUgMTQuNzVoLTEuNVYxMWgxLjV2My43NXpNMTQgMTdjLS40NSAwLS43NS0uMy0uNzUtLjc1cy4zLS43NS43NS0uNzUuNzUuMy43NS43NS0uMy43NS0uNzUuNzV6bTAtOWMtMy4zIDAtNiAyLjctNiA2czIuNyA2IDYgNiA2LTIuNyA2LTYtMi43LTYtNi02eiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTczOCAtNDUxKSB0cmFuc2xhdGUoNzMwIDE4NykgdHJhbnNsYXRlKDAgMjU2KSIvPgogICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4K');`) ||
      (isAlert &&
        `content: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMiIgaGVpZ2h0PSIxMiIgdmlld0JveD0iMCAwIDEyIDEyIj4KICAgIDxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgZmlsbD0iIzEzMjQ0MSIgZmlsbC1ydWxlPSJub256ZXJvIj4KICAgICAgICAgICAgPGc+CiAgICAgICAgICAgICAgICA8Zz4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTQuNzUgMTQuNzVoLTEuNVYxMWgxLjV2My43NXpNMTQgMTdjLS40NSAwLS43NS0uMy0uNzUtLjc1cy4zLS43NS43NS0uNzUuNzUuMy43NS43NS0uMy43NS0uNzUuNzV6bTAtOWMtMy4zIDAtNiAyLjctNiA2czIuNyA2IDYgNiA2LTIuNyA2LTYtMi43LTYtNi02eiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTczOCAtMzA3KSB0cmFuc2xhdGUoNzMwIDE4NykgdHJhbnNsYXRlKDAgMTEyKSIvPgogICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4K');`)}
    margin-top: 1px;
    margin-right: 8px;
    line-height: 1;
  }
`;

const EventTime = styled.div`
  flex-grow: 1;
  font-size: 12px;
  font-weight: normal;
  line-height: 20px;
  margin-left: 8px;
  display: flex;
  align-items: center;
  justify-content: flex-end;

  ${EventLabel} + & {
    margin-right: 8px;
  }
`;

const EventMessage = styled.div`
  flex-basis: 100%;
  padding: 12px 8px;

  &:last-of-type {
    padding-bottom: 4px;
  }
`;

const EventComments = styled.div<{ total: number }>`
  flex-basis: 100%;
  font-style: italic;
  padding-top: 12px;
  padding-bottom: 4px;
  margin: 0 8px;
  position: relative;

  &::before {
    content: '';
    background-image: linear-gradient(
      to left,
      rgba(41, 104, 131, 0.1),
      rgba(19, 36, 65, 0.2) 100%
    );
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
  }

  &::after {
    background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgdmlld0JveD0iMCAwIDEwIDEwIj4KICAgIDxwYXRoIGZpbGw9IiMyMjJBMzgiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTUgMEMyLjI1IDAgMCAxLjkzOCAwIDQuMzc1IDAgNi44MTMgMi4yNSA4Ljc1IDUgOC43NWMuMjUgMCAuNSAwIC42ODgtLjA2M0w4Ljc1IDEwVjcuMjVDOS41IDYuNSAxMCA1LjUgMTAgNC4zNzUgMTAgMS45MzcgNy43NSAwIDUgMCIvPgo8L3N2Zz4K');
    background-repeat: no-repeat;
    background-position: 96% center;
    content: '${({ total }) => total}';
    float: right;
    font-style: normal;
    font-size: 12px;
    padding-right: 14px;
  }
`;

const PerformancePartner = styled(PerformancePane)`
  color: var(--color-dark-blue-grey);
  padding: 24px;
  font-size: 12px;
`;

const PerformancePartnerPicture = styled.div<{ src: string; alt?: string }>`
  background: url(${({ src }) => src});
  background-size: contain;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  box-shadow: 8px 8px 24px 2px rgba(125, 194, 231, 0.25),
    0 0 0 2px rgb(255, 255, 255);
  margin-bottom: 18px;
  margin-right: 16px;
`;

const PerformancePartnerHead = styled.div`
  flex: 1;
`;

const PerformancePartnerTitle = styled.h2`
  font-weight: 600;
  font-size: 16px;
  line-height: 1.25;
  margin-top: 2px;
  margin-bottom: 4px;
  text-transform: capitalize;
`;

const PerformancePartnerInfo = styled.div`
  flex-basis: 100%;
  display: flex;
`;

const PerformancePartnerInfoItem = styled.div<{ icon: string }>`
  display: flex;
  align-items: center;

  * + & {
    margin-left: 24px;
  }

  &::before {
    content: '${({ icon }) => icon}';
    font: 10px '${Fonts.iconFont}';
    margin-right: 8px;
  }
`;

const PerformancePartnerLink = styled.a`
  font-size: 12px;
  font-weight: 500;
  opacity: 0.8;
  text-decoration: underline;
`;

const TimelineBottom = styled.footer`
  flex-grow: 1;
  display: flex;
  align-items: flex-end;
  margin: auto;
  padding-bottom: 24px;
`;

const MoreEvents = styled.a`
  color: var(--color-dark-blue-grey);
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  cursor: pointer;
  transition: 100ms linear;
  opacity: 0.8;

  &:hover {
    opacity: 1;
  }

  &:active {
    opacity: 0.8;
  }
`;

const Timeline = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 65px 16px 0;
  transition: 400ms ease-in;
  display: flex;
  flex-flow: column;
`;

const RatingStar = styled.b<{ isActive: boolean }>`
  & + * {
    margin-left: 2px;
  }

  &::before {
    content: '${Icons.star}';
    color: var(--color-dark);
    font: 10px '${Fonts.iconFont}';
    opacity: ${({ isActive }) => (isActive ? 1 : 0.5)};
  }
`;

const Search = styled.div`
  width: 300px;
  height: 56px;
  background-color: #e7edf6cc;
  border: 1px solid #eef3f8;
  border-radius: 8px;
  box-shadow: -8px -8px 16px rgba(34, 42, 56, 0.03),
    8px 6px 16px rgba(9, 53, 72, 0.13);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  padding: 4px;
  margin-right: 24px;
`;

const SearchInput = styled.input`
  background: transparent;
  border: none;
  flex: 1;
  height: 100%;
  padding: 0 12px;
  caret-color: var(--color-steel);
  font-size: 1rem;
  font-family: 'Jost', sans-serif;

  &::placeholder {
    color: var(--color-steel);
    font-size: 0.8rem;
    text-transform: uppercase;
    position: relative;
    top: -2px;
    line-height: 28px; // Safari fix
  }
`;

const SearchButton = styled.span`
  display: block;
  width: 38px;
  height: 38px;
  transition: box-shadow 100ms linear;

  &::before {
    content: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE1LjcwNyAxMy4yOTNMMTMgMTAuNTg2QzEzLjYzIDkuNTM2IDE0IDguMzExIDE0IDdDMTQgMy4xNCAxMC44NTkgMCA3IDBDMy4xNDEgMCAwIDMuMTQgMCA3QzAgMTAuODYgMy4xNDEgMTQgNyAxNEM4LjMxMiAxNCA5LjUzNiAxMy42MzEgMTAuNTg2IDEzTDEzLjI5MyAxNS43MDdDMTMuNDg4IDE1LjkwMiAxMy43NDQgMTYgMTQgMTZDMTQuMjU2IDE2IDE0LjUxMiAxNS45MDIgMTQuNzA3IDE1LjcwN0wxNS43MDcgMTQuNzA3QzE2LjA5OCAxNC4zMTYgMTYuMDk4IDEzLjY4NCAxNS43MDcgMTMuMjkzWk03IDEyQzQuMjM5IDEyIDIgOS43NjEgMiA3QzIgNC4yMzkgNC4yMzkgMiA3IDJDOS43NjEgMiAxMiA0LjIzOSAxMiA3QzEyIDkuNzYxIDkuNzYxIDEyIDcgMTJaIiBmaWxsPSIjOTI5QkE4Ii8+Cjwvc3ZnPgo=');
    display: block;
    text-align: center;
    line-height: 38px;
  }

  &:active {
    box-shadow: none;
  }
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
    position: relative;
    z-index: 10003;
    cursor: default;

    &:hover {
      box-shadow: 0 0 0 rgba(232, 239, 246, 0.75);

      .beat-ui-dropdown-option-list {
        will-change: max-height;
      }
    }
    * {
      font-family: 'Jost', sans-serif;
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--color-marine);
    }

    .beat-ui-dropdown-option-list {
      background: rgba(232, 239, 246, 0.75);
      box-shadow: 8px 6px 16px rgba(9, 53, 72, 0.08);
      border: 1px solid #eef4fa;
      backdrop-filter: blur(5px);
      border-radius: 4px;
      position: absolute;
      left: 17px;

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
        cursor: default;
        margin: 0;
        white-space: nowrap;

        & > * {
          min-width: 78px;
        }

        &:hover {
          background: #093548;
          backdrop-filter: blur(2px);
          * {
            color: white;
          }
        }
      }
    }

    .beat-ui-dropdown-selected {
      max-height: 38px;
      height: 100%;
      min-width: auto;
      cursor: default;

      * {
        color: var(--color-marine);
        font-family: 'Jost', sans-serif;
        font-size: 0.875rem;
        font-weight: 500;

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

const ServicesDropdown = styled(Dropdown)`
  display: none;
  .beat-ui-dropdown-selected *:first-of-type::before {
    content: ${base64Svg.menuDownArrowSmall.url};
    margin-right: 4px;
  }

  & + * {
    margin-left: 20px;
  }
`;

const DriversDropdown = styled(Dropdown)`
  .beat-ui-dropdown-selected *:first-of-type::before {
    content: ${base64Svg.wheel.url};
    margin-right: 4px;
  }

  & + * {
    margin-left: 20px;
  }
`;

const CommentBox = styled.div<{ isVisible: boolean; offsetTop: number }>`
  width: 364px;
  border-radius: 8px;
  backdrop-filter: blur(6px);
  box-shadow: -8px 0 16px 0 rgba(156, 156, 161, 0.2),
    8px 0 16px 0 var(--color-cornflower-blue-20);
  background: var(--color-pale-grey-40);
  position: absolute;
  top: ${({ offsetTop }) => (offsetTop !== -1 ? `${offsetTop}px` : 'auto')};
  bottom: ${({ offsetTop }) => (offsetTop === -1 ? 0 : 'auto')};
  left: 372px;
  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
  overflow: auto;
  max-height: 50vh;
  padding: 16px;
  ${({ isVisible }) =>
    isVisible ? 'transition: opacity 100ms linear;' : null};
  z-index: 10;
`;

const CommentBoxHead = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  backdrop-filter: blur(6px);
  padding: 16px;
  position: sticky;
  top: -16px;
  margin: -16px -16px 0;
  z-index: 1;
`;

const CommentBoxTitle = styled.h3`
  color: var(--color-dark);
  font-weight: 500;
`;

const CommentBoxClose = styled.span`
  cursor: pointer;

  &::before {
    content: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgdmlld0JveD0iMCAwIDEwIDEwIj4KICAgIDxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgZmlsbD0iIzIyMkEzOCI+CiAgICAgICAgICAgIDxnPgogICAgICAgICAgICAgICAgPHBhdGggZD0iTTM0Ny43ODYgMjMuMjE0Yy0uMjg2LS4yODUtLjcxNS0uMjg1LTEgMEwzNDMgMjdsLTMuNzg2LTMuNzg2Yy0uMjg1LS4yODUtLjcxNC0uMjg1LTEgMC0uMjg1LjI4Ni0uMjg1LjcxNSAwIDFMMzQyIDI4bC0zLjc4NiAzLjc4NmMtLjI4NS4yODUtLjI4NS43MTQgMCAxIC4xNDMuMTQzLjI4Ni4yMTQuNS4yMTQuMjE1IDAgLjM1Ny0uMDcxLjUtLjIxNEwzNDMgMjlsMy43ODYgMy43ODZjLjE0My4xNDMuMzU3LjIxNC41LjIxNC4xNDMgMCAuMzU3LS4wNzEuNS0uMjE0LjI4NS0uMjg2LjI4NS0uNzE1IDAtMUwzNDQgMjhsMy43ODYtMy43ODZjLjI4NS0uMjg1LjI4NS0uNzE0IDAtMSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTc3MyAtMjcwMSkgdHJhbnNsYXRlKDQzNSAyNjc4KSIvPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4K');
  }
`;

const CommentBoxBottom = styled.div`
  backdrop-filter: blur(6px);
  margin: 0 -16px -16px;
  padding: 16px;
  position: sticky;
  top: calc(100% - 60px);
  z-index: 1;
`;

const CommentBoxInput = styled.input<{ isActive?: boolean }>`
  border-radius: 8px;
  backdrop-filter: blur(4px);
  box-shadow: ${({ isActive }) =>
    isActive
      ? `4px 8px 10px 0 rgba(144, 180, 197, 0.4),
  -8px -8px 16px 0 rgba(173, 173, 191, 0.1),
  inset 8px 8px 14px 0 rgba(175, 204, 213, 0.26),
  inset 8px 8px 14px 0 rgba(255, 255, 255, 0.28)`
      : `4px 8px 12px 0 rgba(144, 180, 197, 0.2),
    -8px -8px 16px 0 rgba(174, 174, 192, 0.15),
    inset 8px 8px 14px 0 rgba(175, 204, 213, 0.26),
    inset 8px 8px 14px 0 rgba(255, 255, 255, 0.28)`};
  border: solid 1px white;
  caret-color: var(--color-steel);
  font-family: 'Jost', sans-serif;
  font-size: 1rem;
  line-height: 24px; // Safari fix
  height: 44px;
  margin-bottom: 8px;
  padding: 12px;
  width: 100%;
  transition: 100ms ease-in-out;

  &::placeholder {
    color: var(--color-steel);
    font-size: 14px;
    font-style: italic;
    position: relative;
    top: -1px;
  }
`;

const CommentBoxButton = styled.span<{ isActive?: boolean }>`
  border-radius: 4px;
  background: var(
    ${({ isActive }) => (isActive ? '--color-dark' : '--color-steel')}
  );
  color: white;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.5;
  padding: 12px 12px 11px;
  display: block;
  text-align: center;
  user-select: none;
  cursor: pointer;
  transition: 100ms ease;

  &:active {
    background: var(
      ${({ isActive }) =>
        isActive ? '--color-dark-blue-grey' : '--color-steel'}
    );
  }
`;

const CommentBoxBody = styled.div`
  margin: -76px -16px -16px;
  padding: 0 16px 76px;
`;

const Comment = styled.div`
  margin-bottom: 24px;
`;

const CommentBody = styled.p`
  backdrop-filter: blur(4px);
  background: white;
  border-radius: 8px;
  box-shadow: 4px 8px 12px 0 rgba(144, 180, 197, 0.2),
    -8px -8px 16px 0 rgba(174, 174, 192, 0.15),
    inset 8px 8px 14px 0 rgba(175, 204, 213, 0.26),
    inset 8px 8px 14px 0 rgba(255, 255, 255, 0.28);
  border: solid 1px white;
  color: var(--color-dark);
  font-size: 14px;
  margin-bottom: 8px;
  padding: 12px;
  line-height: 1.4;
`;

const CommentMeta = styled.div`
  color: var(--color-grey-blue);
  font-size: 12px;
  font-weight: 500;
  text-align: right;
`;

const CommentAuthor = styled.span();

const CommentPassedTime = styled.span`
  * + &::before {
    content: '';
    background: var(--color-grey-blue);
    border-radius: 50%;
    display: inline-block;
    margin: 0 8px;
    width: 3px;
    height: 3px;
    vertical-align: middle;
  }
`;

const EmptyResults = styled.div`
  margin: 75px 0;
  text-align: center;
`;

const EmptyResultsGfx = styled(EmptyResultsSvg)`
  margin-bottom: 32px;
`;

const EmptyResultsTitle = styled.h3`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 32px;
`;

const EmptyResultsText = styled.p`
  font-size: 16px;
  font-weight: 400;
  line-height: 1.3;
`;

const Tooltip = styled.span`
  backdrop-filter: blur(6px);
  background-image: linear-gradient(
    80deg,
    rgb(134, 146, 162),
    rgb(146, 172, 189) 99%
  );
  border-radius: 8px;
  box-shadow: -8px 0 16px 0 rgba(156, 156, 161, 0.11);
  color: white;
  font-size: 14px;
  font-weight: 500;
  left: 50%;
  padding: 4px 17px;
  width: auto; // Safari fix
  white-space: nowrap;
  position: absolute;
  top: calc(100% + 15px);
  opacity: 0;
  transform: translateX(-50%) scale(0);
  transition: opacity 200ms ease-in-out 500ms;
`;

const ActionButton = styled.span`
  background-repeat: no-repeat;
  background-position: center;
  cursor: var(--cursor-base64-url) 12 12, auto;
  display: inline-block;
  height: 14px;
  width: 14px;
  position: relative;
  vertical-align: middle;

  * + & {
    margin-left: 38px;
  }

  &:hover {
    opacity: 1;
  }

  &:hover ${Tooltip} {
    opacity: 0.9;
    transform: translateX(-50%) scale(1);
  }

  &:hover::before {
    background-image: radial-gradient(
      rgba(19, 36, 65, 0.15) 0,
      transparent 100%
    );
    content: '';
    box-shadow: 0 0 16px rgba(19, 36, 65, 0.1);
    border-radius: 50%;
    width: 48px;
    height: 48px;
    left: 50%;
    position: absolute;
    transform: translate(-50%, -50%);
    top: 50%;
  }
`;

const ActionReviewItem = styled(ActionButton)<{
  isUnreviewed: boolean;
  isActive: boolean;
}>`
  background-image: url('data:image/svg+xml;base64,${({ isUnreviewed }) =>
    isUnreviewed
      ? `PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNCIgaGVpZ2h0PSIxMSIgdmlld0JveD0iMCAwIDE0IDExIj4KICAgIDxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgZmlsbD0iIzY5Nzg4RSI+CiAgICAgICAgICAgIDxnPgogICAgICAgICAgICAgICAgPHBhdGggZD0iTTE1Mi41NTkgNjdMMTU0IDY4LjA2MSAxNDYuMTY1IDc4IDE0MCA3Mi43ODYgMTQxLjE5MyA3MS40NjggMTQ1Ljg5OSA3NS40NDd6IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTk0IC0zOTM3KSB0cmFuc2xhdGUoNTQgMzg3MCkiLz4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+Cg==`
      : `PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyIiBoZWlnaHQ9IjE0IiB2aWV3Qm94PSIwIDAgMiAxNCI+CiAgICA8ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGZpbGw9IiM2OTc4OEUiPgogICAgICAgICAgICA8Zz4KICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0yMTggNzkuOTgxdi0uOTk4aC0ydi45OThoMnptLTIgLjAyVjgxaDJ2LS45OTloLTJ6TTIxNiA2N3Y3Ljk4OWgyVjY3aC0yem0wIDEyLjk4MXYuMDJoMnYtLjAyaC0yeiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTI3MCAtMzkzNykgdHJhbnNsYXRlKDU0IDM4NzApIi8+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPgo=`}');
  visibility: ${({ isActive }) => (isActive ? 'visible' : 'hidden')};

  &:hover {
    background-image: url('data:image/svg+xml;base64,${({ isUnreviewed }) =>
      isUnreviewed
        ? `PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNCIgaGVpZ2h0PSIxMSIgdmlld0JveD0iMCAwIDE0IDExIj4KICAgIDxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgZmlsbD0iIzEzMjQ0MSI+CiAgICAgICAgICAgIDxnPgogICAgICAgICAgICAgICAgPHBhdGggZD0iTTE1Mi41NTkgMTA2TDE1NCAxMDcuMDYxIDE0Ni4xNjUgMTE3IDE0MCAxMTEuNzg2IDE0MS4xOTMgMTEwLjQ2OCAxNDUuODk5IDExNC40NDd6IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTk0IC0zOTc2KSB0cmFuc2xhdGUoNTQgMzg3MCkiLz4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+Cg==`
        : `PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyIiBoZWlnaHQ9IjE0IiB2aWV3Qm94PSIwIDAgMiAxNCI+CiAgICA8ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGZpbGw9IiMxMzI0NDEiPgogICAgICAgICAgICA8Zz4KICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0yMTggMTE3Ljk4MXYtLjk5OGgtMnYuOTk4aDJ6bS0yIC4wMlYxMTloMnYtLjk5OWgtMnpNMjE2IDEwNXY3Ljk4OWgyVjEwNWgtMnptMCAxMi45ODF2LjAyaDJ2LS4wMmgtMnoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yNzAgLTM5NzUpIHRyYW5zbGF0ZSg1NCAzODcwKSIvPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4K`}');
  }
`;

const ActionSelectItem = styled(ActionButton)`
  background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNCIgaGVpZ2h0PSIxMCIgdmlld0JveD0iMCAwIDE0IDEwIj4KICAgIDxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgZmlsbD0iIzY5Nzg4RSI+CiAgICAgICAgICAgIDxnPgogICAgICAgICAgICAgICAgPHBhdGggZD0iTTE5MS43NzIgNzMuNTU2TDE4Ny4zNjUgNzhsLTEuMTAyLTEuMTExIDMuMDc3LTMuMTAzSDE3OHYtMS41NzJoMTEuMzRsLTMuMDc3LTMuMTAzTDE4Ny4zNjUgNjhsNC40MDcgNC40NDRjLjI3OS4yODIuMzAyLjcyMy4wNyAxLjAzMWwtLjA3LjA4eiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTIzMiAtMzkzOCkgdHJhbnNsYXRlKDU0IDM4NzApIi8+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPgo=');

  &:hover {
    background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNCIgaGVpZ2h0PSIxMCIgdmlld0JveD0iMCAwIDE0IDEwIj4KICAgIDxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgZmlsbD0iIzEzMjQ0MSI+CiAgICAgICAgICAgIDxnPgogICAgICAgICAgICAgICAgPHBhdGggZD0iTTE5MS43NzIgMTEyLjU1NkwxODcuMzY1IDExN2wtMS4xMDItMS4xMTEgMy4wNzctMy4xMDNIMTc4di0xLjU3MmgxMS4zNGwtMy4wNzctMy4xMDMgMS4xMDItMS4xMTEgNC40MDcgNC40NDRjLjI3OS4yODIuMzAyLjcyMy4wNyAxLjAzMWwtLjA3LjA4eiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTIzMiAtMzk3NykgdHJhbnNsYXRlKDU0IDM4NzApIi8+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPgo=');
  }
`;

const ListItemActions = styled.div<any>`
  > * {
    opacity: 0;
    transition: 100ms linear;
  }

  ${DataTableRow}:hover & > * {
    opacity: 1;
  }
`;

const FullName = styled.div`
  overflow: hidden;
  padding-right: 12px;
  text-overflow: ellipsis;
  text-transform: capitalize;
  width: 100%;
`;

const AvailabilityIconContainer = styled.div`
  height: 8px;
  margin-right: 8px;
  width: 8px;
`;

const IconContainer = styled.div`
  width: 100%;
`;

const PLAChekinWrapper = styled.div`
  min-width: 1rem;
  max-width: 100%;
`;

const AvailabilityIcon = styled.div<{
  availability: DriverAvailability;
}>`
  background-color: ${({ availability }) => {
    switch (availability) {
      case DriverAvailability.Unavailable:
        return '#BE4824';
      case DriverAvailability.Available:
        return '#09949F';
      case DriverAvailability.NotLogged:
      default:
        return '#929BA8';
    }
  }};
  border-radius: 50%;
  height: 100%;
  width: 100%;
`;

const DriverID = styled.div`
  text-decoration: underline;
  font-size: 0.75rem;
  opacity: 0.8;
`;

const InfoIcon = styled.div`
  background: ${base64Svg.bufferDriver.url} no-repeat;
  display: flex;
  height: 13px;
  width: 13px;
  margin-top: -1px;
  position: relative;
  z-index: 1;
`;

const MainDataContainer = styled.section`
  display: flex;
  height: 100%;
  justify-content: space-between;
  overflow: hidden;
`;

const ShiftsContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  min-width: 760px;
  overflow: hidden;
  padding: 12px 16px 0 0;
`;

const ShiftsInnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
`;

const ShiftsFiltersContainer = styled.div`
  align-items: center;
  display: flex;
`;

const SidePanelContainer = styled.aside`
  border-left: 0.5px solid #929ba8;
  height: 100%;
  padding: 12px 24px 22px 16px;
  overflow-x: hidden;
  overflow-y: scroll;
  width: 575px;
`;

const SidePanelInnerContainer = styled.div`
  background-color: #ffffffb3;
  backdrop-filter: blur(8.15485px);
  border-radius: 8px;
  box-shadow: 8px 0px 16px rgba(106, 167, 217, 0.196842),
    -8px 0px 16px rgba(156, 156, 161, 0.202551);
  height: 100%;
  min-height: 785px;
  padding: 26px 18px 20px 24px;
`;

export default {
  Header,
  ShiftsHeader,
  HeaderTitle,
  Switch,
  SwitchSlider,
  DataTable,
  DataTableBody,
  DataTableColumn,
  DataTableHead,
  DataTableRow,
  DataTableRowSkeleton,
  DataTableColumnSkeleton,
  DataTableNotice,
  ActionReviewItem,
  ActionSelectItem,
  Tooltip,
  View,
  Performance,
  PerformanceHeader,
  PerformanceBody,
  PerformancePane,
  PerformancePartnerStatus,
  PerformanceTitle,
  PerformanceDatetime,
  PerformancePartner,
  PerformancePartnerPicture,
  PerformancePartnerHead,
  PerformancePartnerTitle,
  PerformancePartnerInfo,
  PerformancePartnerInfoItem,
  PerformancePartnerLink,
  PerformanceTimeline,
  Progress,
  ProgressLabel,
  ProgressBar,
  PerformanceMetrics,
  PerformanceKpiBox,
  PerformanceKpi,
  PerformanceKpiCaption,
  OfflineTooltip,
  EventGroup,
  EventGroupHead,
  EventGroupTitle,
  EventGroupBody,
  Event,
  EventLink,
  EventLabel,
  EventTime,
  EventMessage,
  EventComments,
  MoreEvents,
  TimelineBottom,
  Timeline,
  Stage,
  Map,
  RatingStar,
  ListItemActions,
  Search,
  SearchInput,
  SearchButton,
  CommentBox,
  CommentBoxHead,
  CommentBoxBody,
  CommentBoxTitle,
  CommentBoxClose,
  CommentBoxBottom,
  CommentBoxInput,
  CommentBoxButton,
  Comment,
  CommentBody,
  CommentMeta,
  CommentAuthor,
  CommentPassedTime,
  EmptyResults,
  EmptyResultsGfx,
  EmptyResultsTitle,
  EmptyResultsText,
  InternalLink,
  FullName,
  AvailabilityIconContainer,
  AvailabilityIcon,
  DriverID,
  InfoIcon,
  Icon,
  ServicesDropdown,
  DriversDropdown,
  IconContainer,
  PLAChekinWrapper,
  AccordionContainer,
  AccordionHeader,
  AccordionHeaderTextContainer,
  AccordionContent,
  MainDataContainer,
  ShiftsContainer,
  ShiftsInnerContainer,
  ShiftsFiltersContainer,
  SidePanelContainer,
  SidePanelInnerContainer
};
