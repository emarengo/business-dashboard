import styled from '@emotion/styled/macro';
import { css, keyframes } from '@emotion/core';
import { Fonts, Icons } from '@thebeatapp/beat-ui';

const vars = css`
  --color-dark: #222a38;
  --color-pale-grey: #f4f7f9;
  --color-pale-grey-40: rgba(238, 240, 245, 0.4);
  --color-dark-blue-grey: #132441;
  --color-dark-blue-grey-50: rgb(19, 36, 65, 0.5);
  --color-tomato: #ee5a23;
  --color-dark-tomato: #ee3b23;
  --color-dusk: #413f60;
  --color-steel-60: rgba(108, 122, 145, 0.6);
  --color-cornflower-blue-20: rgba(106, 167, 217, 0.2);
  --color-tealish: #23d2aa;
  --color-battleship-grey: #66667e;
  --color-marine: #093548;

  --cursor-base64-url: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMzRweCIgaGVpZ2h0PSIzNHB4IiB2aWV3Qm94PSIwIDAgMzQgMzQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+Y3Vyc29yPC90aXRsZT4KICAgIDxkZWZzPgogICAgICAgIDxjaXJjbGUgaWQ9InBhdGgtMSIgY3g9IjM2NSIgY3k9IjI2OCIgcj0iNiI+PC9jaXJjbGU+CiAgICAgICAgPGZpbHRlciB4PSItMTM3LjUlIiB5PSItMTM3LjUlIiB3aWR0aD0iMzc1LjAlIiBoZWlnaHQ9IjM3NS4wJSIgZmlsdGVyVW5pdHM9Im9iamVjdEJvdW5kaW5nQm94IiBpZD0iZmlsdGVyLTIiPgogICAgICAgICAgICA8ZmVNb3JwaG9sb2d5IHJhZGl1cz0iMS41IiBvcGVyYXRvcj0iZGlsYXRlIiBpbj0iU291cmNlQWxwaGEiIHJlc3VsdD0ic2hhZG93U3ByZWFkT3V0ZXIxIj48L2ZlTW9ycGhvbG9neT4KICAgICAgICAgICAgPGZlT2Zmc2V0IGR4PSIwIiBkeT0iMCIgaW49InNoYWRvd1NwcmVhZE91dGVyMSIgcmVzdWx0PSJzaGFkb3dPZmZzZXRPdXRlcjEiPjwvZmVPZmZzZXQ+CiAgICAgICAgICAgIDxmZUdhdXNzaWFuQmx1ciBzdGREZXZpYXRpb249IjQiIGluPSJzaGFkb3dPZmZzZXRPdXRlcjEiIHJlc3VsdD0ic2hhZG93Qmx1ck91dGVyMSI+PC9mZUdhdXNzaWFuQmx1cj4KICAgICAgICAgICAgPGZlQ29tcG9zaXRlIGluPSJzaGFkb3dCbHVyT3V0ZXIxIiBpbjI9IlNvdXJjZUFscGhhIiBvcGVyYXRvcj0ib3V0IiByZXN1bHQ9InNoYWRvd0JsdXJPdXRlcjEiPjwvZmVDb21wb3NpdGU+CiAgICAgICAgICAgIDxmZUNvbG9yTWF0cml4IHZhbHVlcz0iMCAwIDAgMCAwLjA3NDUwOTgwMzkgICAwIDAgMCAwIDAuMTQxMTc2NDcxICAgMCAwIDAgMCAwLjI1NDkwMTk2MSAgMCAwIDAgMC40IDAiIHR5cGU9Im1hdHJpeCIgaW49InNoYWRvd0JsdXJPdXRlcjEiPjwvZmVDb2xvck1hdHJpeD4KICAgICAgICA8L2ZpbHRlcj4KICAgIDwvZGVmcz4KICAgIDxnIGlkPSJTaGlmdC1NYW5hZ2VtZW50IiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iTmV3LWNvbXBvbmVudHMiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0zNDguMDAwMDAwLCAtMjUxLjAwMDAwMCkiPgogICAgICAgICAgICA8ZyBpZD0iY3Vyc29yIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgzNjUuMDAwMDAwLCAyNjguMDAwMDAwKSByb3RhdGUoLTM2MC4wMDAwMDApIHRyYW5zbGF0ZSgtMzY1LjAwMDAwMCwgLTI2OC4wMDAwMDApICI+CiAgICAgICAgICAgICAgICA8dXNlIGZpbGw9ImJsYWNrIiBmaWxsLW9wYWNpdHk9IjEiIGZpbHRlcj0idXJsKCNmaWx0ZXItMikiIHhsaW5rOmhyZWY9IiNwYXRoLTEiPjwvdXNlPgogICAgICAgICAgICAgICAgPHVzZSBmaWxsLW9wYWNpdHk9IjAuNTk3Njc0IiBmaWxsPSIjRkZGRkZGIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHhsaW5rOmhyZWY9IiNwYXRoLTEiPjwvdXNlPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=');
`;

const blink = keyframes`
  from {
    opacity: 0.4;
  }

  to {
    opacity: 1;
  }
`;

const Notifications = styled.div``;

const NotificationPaneToggle = styled.button<{ isBulletPointVisible: boolean }>`
  ${vars};
  background: rgba(255, 255, 255, 0.4);
  border: solid 1px #f2f2f4;
  border-radius: 50%;
  box-shadow: 6px 6px 17px 0 rgba(125, 194, 231, 0.43);
  cursor: var(--cursor-base64-url) 12 12, auto;
  display: flex;
  width: 46px;
  height: 46px;
  position: fixed;
  top: 24px;
  right: 24px;
  user-select: none;
  transition: 100ms linear;
  z-index: 9998;

  &::before {
    content: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMiIgaGVpZ2h0PSIxMiIgdmlld0JveD0iMCAwIDEyIDEyIj4KICAgIDxkZWZzPgogICAgICAgIDxyYWRpYWxHcmFkaWVudCBpZD0iMjQ3ZHBud3g3YSIgY3g9IjUwJSIgY3k9Ii0xMi40ODIlIiByPSIxMzUuODA2JSIgZng9IjUwJSIgZnk9Ii0xMi40ODIlIiBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDAgMSAtLjk2NyAwIC4zOCAtLjYyNSkiPgogICAgICAgICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjMjk2ODgzIi8+CiAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzEzMjQ0MSIvPgogICAgICAgIDwvcmFkaWFsR3JhZGllbnQ+CiAgICA8L2RlZnM+CiAgICA8cGF0aCBmaWxsPSJ1cmwoIzI0N2Rwbnd4N2EpIiBkPSJNMjQuNSAyNy41YzAgLjgyNS0uNjc1IDEuNS0xLjUgMS41cy0xLjUtLjY3NS0xLjUtMS41ek0yMyAxN2MyLjEgMCAzLjc1IDEuNjUgMy43NSAzLjc1VjIzYzAgLjk3NS42IDEuNzI1IDEuMTI1IDIuMjVoLjM3NWMuNDUgMCAuNzUuMy43NS43NXMtLjMuNzUtLjc1Ljc1aC0xMC41Yy0uNDUgMC0uNzUtLjMtLjc1LS43NXMuMy0uNzUuNzUtLjc1aC4zNzVjLjUyNS0uNTI1IDEuMTI1LTEuMjc1IDEuMTI1LTIuMjV2LTIuMjVjMC0yLjEgMS42NS0zLjc1IDMuNzUtMy43NXoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xNyAtMTcpIi8+Cjwvc3ZnPgo=');
    background: #eff2f2;
    backdrop-filter: blur(2px);
    box-shadow: 8px 8px 14px 0 rgba(174, 174, 192, 0.57),
      inset -8px -8px 14px 0 rgba(255, 255, 255, 0.9),
      inset 8px 8px 14px 0 rgba(255, 255, 255, 0.5);
    border: solid 1px #f2f2f4;
    border-radius: inherit;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 2px;
    position: absolute; // Use this apporach to please Safari
    top: 4px;
    left: 4px;
    right: 4px;
    bottom: 4px;
    transition: 100ms linear;
  }

  &:hover::before {
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  &:active {
    background: #eff2f2;

    &::before {
      box-shadow: none;
    }
  }

  // Bullet point
  &::after {
    ${({ isBulletPointVisible }) => isBulletPointVisible && `content: ''`};
    border-radius: 50%;
    background: var(--color-dark-tomato);
    width: 5px;
    height: 5px;
    position: absolute;
    top: 12px;
    right: 12px;
  }
`;

const NotificationPane = styled.div<{ isVisible: boolean }>`
  border-radius: 8px;
  backdrop-filter: blur(6px);
  box-shadow: -8px 0 16px 0 rgba(156, 156, 161, 0.2),
    8px 0 16px 0 var(--color-cornflower-blue-20);
  background: var(--color-pale-grey-40);
  display: flex;
  flex-flow: column;
  font-family: 'Jost';
  position: fixed;
  top: ${({ isVisible }) => (isVisible ? 76 : 71)}px;
  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
  transform: scale(${({ isVisible }) => (isVisible ? 1 : 0)});
  right: 24px;
  width: 307px;
  height: 521px;
  overflow: auto;
  padding: 16px;
  z-index: 10002;
  transition: 150ms ease-in-out,
    transform 0ms ${({ isVisible }) => (isVisible ? 0 : 150)}ms;
`;

const NotificationPaneHead = styled.header`
  background: rgba(225, 229, 235, 0.2);
  backdrop-filter: blur(6px);
  margin: -16px -16px 0 -16px;
  padding: 16px;
  position: sticky;
  top: -16px;
  z-index: 1;
`;

const NotificationPaneTitle = styled.h2<{ count: number }>`
  font-size: 16px;
  font-weight: 600;
  line-height: 1.5;

  &::after {
    content: '${({ count }) => count}';
    background: var(--color-dark-blue-grey);
    border-radius: 9px;
    height: 18px;
    color: white;
    font-size: 10px;
    padding: 0px 8px;
    margin-left: 20px;
    vertical-align: 1px;
  }
`;

const NotificationPaneBody = styled.div`
  flex: 1;
`;

const NotificationSubject = styled.div`
  font-size: 14px;
  line-height: 20px;
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-transform: capitalize;
`;

const NotificationSubjectExtra = styled.div`
  color: var(--color-dark-blue-grey);
  font-size: 12px;
  font-weight: 500;
  line-height: 1.5;
  align-self: flex-start;
  margin-top: 1px;
  margin-left: 16px;
  white-space: nowrap;

  &::before {
    content: '${Icons.taxi}';
    font: 10px '${Fonts.iconFont}';
    margin-right: 4px;
    vertical-align: -1px;
  }
`;

const NotificationSubjectStatus = styled.div`
  font-size: 12px;
  display: flex;
  justify-content: space-between;
  align-self: center;
  line-height: 1.4;

  &::before {
    content: '${Icons.info}';
    font: 10px '${Fonts.iconFont}';
    margin-right: 4px;
    text-transform: none;
    line-height: 16px;
  }
`;

// Need a block element to 'capitalize' the first letter
const NotificationSubjectStatusText = styled.div`
  max-width: 60%;

  &::first-letter {
    text-transform: uppercase;
  }
`;

const NotificationTimeElapsed = styled.div`
  color: var(--color-dark-blue-grey);
  font-size: 12px;
  font-weight: 600;
  opacity: 0.6;
  flex: 1;
  text-align: right;
`;

const Notification = styled.div<{ isUnreviewed: boolean }>`
  background: var(--color-pale-grey);
  border-radius: 8px;
  box-shadow: inset 0 0 0 1px white;
  padding: 10px 14px 13px 12px;
  font-weight: 600;
  position: relative;
  cursor: pointer;

  * + & {
    margin-top: 12px;
  }

  &::before {
    content: '';
    background: var(--color-tomato);
    width: 4px;
    height: 4px;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    transform: translate(0, -50%, 0);
    left: -10px;
    display: ${({ isUnreviewed }) => (isUnreviewed ? 'block' : 'none')};
  }

  &:hover {
    background: white;
    box-shadow: 0 4px 8px 0 var(--color-cornflower-blue-20);
    transition-timing-function: ease-in-out;
  }

  ${NotificationSubjectStatus} {
    color: var(
      ${({ isUnreviewed }) =>
        isUnreviewed ? '--color-tomato' : '--color-dark'}
    );
  }
`;

const NotificationSkeleton = styled.div<{ isVisible: boolean }>`
  border-radius: 8px;
  box-shadow: inset 0 0 0 1px white;
  background: var(--color-pale-grey);
  display: ${({ isVisible }) => (isVisible ? 'flex' : 'none')};
  justify-content: center;
  flex-flow: column;
  width: 275px;
  height: 67px;
  padding: 12px 16px;
  margin-top: 12px;

  &::before,
  &::after {
    content: '';
    animation: ${blink} 500ms ease-in-out infinite alternate;
    background: rgba(19, 36, 65, 0.1);
    border-radius: 14px;
    display: block;
  }

  &::before {
    width: 85%;
    height: 13px;
    margin-bottom: 8px;
  }

  &::after {
    width: 60%;
    height: 13px;
  }
`;

export default {
  Notifications,
  NotificationPane,
  NotificationPaneToggle,
  NotificationPaneHead,
  NotificationPaneTitle,
  NotificationPaneBody,
  Notification,
  NotificationSubject,
  NotificationSubjectExtra,
  NotificationSubjectStatus,
  NotificationSubjectStatusText,
  NotificationTimeElapsed,
  NotificationSkeleton
};
