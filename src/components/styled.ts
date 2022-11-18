/* eslint-disable complexity */
import styled from '@emotion/styled/macro';
import {
  NavListItem as NavListItemBase,
  SideNav as SideNavBase,
  NavListItemIcon,
  Icons,
  Fonts
} from '@thebeatapp/beat-ui';
import teslaIcon from '../assets/tesla-icon.png';
import teslaIconX2 from '../assets/tesla-icon@2x.png';
import { base64Svg } from './svgs';

const Dashboard = styled.div`
  display: flex;
  font-family: ${({ theme }) => theme.fonts.regular};
  height: 100%;
`;

const Stage = styled.main`
  display: flex;
  flex-flow: column;
  min-width: 700px;
  box-shadow: inset 0 0 8px 0 rgba(0, 0, 40, 0.16);
  overflow: auto;
  width: 100%;
  padding-left: 60px;
  background: #dde6f2;
`;

const SvgBase64 = {
  success:
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgdmlld0JveD0iMCAwIDE4IDE4Ij4KICAgIDxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgZmlsbD0iIzExOTdBMSIgZmlsbC1ydWxlPSJub256ZXJvIj4KICAgICAgICAgICAgPGc+CiAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMzIuNzk4IDIxLjAwMmMtMi4zNC4wMjItNC42MzUgMS4wMTItNi4yMzMgMi42NzdDMjQuOTIzIDI1LjM0MyAyMy45NzggMjcuNjYgMjQgMzBjLS4wMjIgMi4zNC45MjMgNC42NTcgMi41NjUgNi4zMjEgMS42MiAxLjY2NSAzLjkxNSAyLjY1NSA2LjIzMyAyLjY3NyAyLjMxNy4wNDUgNC42OC0uODc3IDYuMzY3LTIuNTQyQzQwLjg3NSAzNC44MTQgNDEuOTMzIDMyLjQzIDQyIDMwYy0uMDY3LTIuNDUyLTEuMTQ3LTQuODE0LTIuODU3LTYuNDU2LTEuNjg4LTEuNjQzLTQuMDI4LTIuNTg3LTYuMzQ1LTIuNTQyem00LjU5IDYuMzQzbC01LjA4NSA2Ljc1Yy0uMTguMjQ3LS41NjMuMjctLjc2NS4wNDRsLTIuOTAzLTIuOTQ3Yy0uMjAyLS4yMDItLjE4LS41NC4wMjMtLjcybDEuMzA1LTEuMTdjLjIwMi0uMTguNTQtLjE1Ny43Mi4wNDZsLjkyMi45Yy4xMTMuMTEyLjI5My4xMTIuMzgzIDBsMy41MzItNC4zNjVjLjE4LS4yMjUuNDk1LS4yNDcuNjk4LS4wOWwxLjA1Ny44MzNjLjI0OC4xOC4yOTMuNDk0LjExMy43MnoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xMTQ4IC0xNjUpIHRyYW5zbGF0ZSgxMTI0IDE0NCkiLz4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+Cg==',
  failure:
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgdmlld0JveD0iMCAwIDE4IDE4Ij4KICAgIDxnIGZpbGw9Im5vbmUiIGZpbGwtb3BhY2l0eT0iLjgwNCIgZmlsbC1ydWxlPSJldmVub2RkIiBvcGFjaXR5PSIuOTk3Ij4KICAgICAgICA8ZyBmaWxsPSIjQkU0ODI0Ij4KICAgICAgICAgICAgPGc+CiAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMzMuMTkgMjEuMDAyYzIuMzM4LjAyMiA0LjYzIDEuMDEyIDYuMjI1IDIuNjc3QzQxLjA1NSAyNS4zNDMgNDIgMjcuNjgzIDQyIDMwLjAyMmMuMDIyIDIuMzE4LS45MjIgNC42NTctMi41NjIgNi4zLTEuNjE4IDEuNjY0LTMuOTEgMi42NTQtNi4yMjUgMi42NzYtMi4zMTQuMDQ1LTQuNjc0LS45LTYuMzYtMi41NDJDMjUuMTQ3IDM0LjgxNCAyNC4wNjggMzIuNDUyIDI0IDMwYy4wNjctMi40MyAxLjEyNC00LjgxNCAyLjgzMS02LjQ1NiAxLjcwOC0xLjY0MyA0LjA0NS0yLjU4NyA2LjM2LTIuNTQyem0tLjIyNCAxMS40NzNjLS40MDguMDIzLS44MTYuMTgyLTEuMDg4LjQ3OS0uMjk0LjI3NC0uNDUzLjY4NC0uNDUzIDEuMDk1IDAgLjQxLjE4MS43OTguNDUzIDEuMDk1LjI5NS4yOTYuNjguNDc5IDEuMDg4LjQ3OS40MDguMDIzLjgxNi0uMTM3IDEuMTEtLjQzNC4yOTUtLjI3My40NzYtLjY4NC40OTktMS4xNjMtLjAyMy0uNDEtLjIwNC0uODQ0LS40OTktMS4xMTgtLjI5NC0uMjczLS43MDItLjQzMy0xLjExLS40MzN6bTEuMDM4LTguMWgtMi4wMDhjLS4zMiAwLS41NzEuMjc4LS41NzEuNjAybC4wOTEgNS4xNDJjMCAuMzAxLjI1MS41NTYuNTcxLjU1NmgxLjgyNmMuMzIgMCAuNTctLjIzMi41Ny0uNTU2bC4wOTItNS4xNjVjMC0uMzI0LS4yNTEtLjU3OS0uNTctLjU3OXoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC05ODUgLTk3KSB0cmFuc2xhdGUoOTYxIDc2KSIvPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4K'
};

const Notification = styled.div<{ isVisible: boolean; type: string }>`
  --color-faded-orange: #f38258;
  --color-tealish: #23d2aa;
  --color-dark: #1f252f;
  color: var(--color-dark);
  padding: 21px 24px;
  border-radius: 4px;
  backdrop-filter: blur(4px);
  box-shadow: -8px 0 16px 0 rgba(156, 156, 161, 0.11),
    8px 0 16px 0 rgba(90, 168, 202, 0.13);
  background: rgba(238, 240, 245, 0.45);
  display: flex;
  align-items: center;
  font-family: 'Jost', sans-serif;
  position: fixed;
  top: ${({ isVisible }) => (!isVisible ? 70 : 90)}px;
  opacity: ${({ isVisible }) => (!isVisible ? 0 : 1)};
  transform: scale(${({ isVisible }) => (!isVisible ? 0 : 1)});
  transition: opacity 200ms ease-in, top 200ms ease-out,
    transform 0ms ${({ isVisible }) => (isVisible ? 0 : 200)}ms;
  right: 40px;
  z-index: 100;

  &::before {
    content: url('${({ type }) =>
      (type === 'success' && SvgBase64.success) ||
      (type === 'failure' && SvgBase64.failure)}');
    color: var(
      ${({ type }) =>
        (type === 'success' && '--color-tealish') ||
        (type === 'failure' && '--color-faded-orange')}
    );
    margin-right: 14px;
    height: 18px;
  }
`;

const NotificationTitle = styled.h3`
  font-weight: 600;
  font-size: 16px;

  & + * {
    margin-top: 2px;
  }
`;

const NotificationMessage = styled.div`
  font-size: 14px;
  line-height: 20px;
`;

const NotificationBody = styled.div`
  flex: 1;
`;

const NotificationClose = styled.span`
  cursor: pointer;
  margin-left: 32px;

  &::after {
    content: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMiIgaGVpZ2h0PSIxMiIgdmlld0JveD0iMCAwIDEyIDEyIj48cGF0aCBmaWxsPSIjMzczNzM3IiBmaWxsLW9wYWNpdHk9Ii40IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMS4xNjMuMTFsLjcxOC42NTljLjE1My4xNC4xNjEuMzcxLjAwOC41MThsLTQuNTY2IDQuNjggNC41NjYgNC43NDljLjE1My4xNDcuMTQ1LjM3OC0uMDA4LjUxOWwtLjcxLjY1MWMtLjE2LjE0Ny0uNDIuMTQ3LS41NzMgMEw2LjE2NiA3LjI2Yy0uMDc3LS4wODUtLjIxNC0uMDkyLS4zMDYtLjAxNC0uMzA2LjI5NC00LjAyMiA0LjI1NS00LjQ1IDQuNjQ3LS4xNi4xNDctLjQxMy4xNDctLjU3MyAwbC0uNzE4LS42NThjLS4xNTMtLjE0LS4xNjEtLjM3Mi0uMDA4LS41MTlMNC42NjYgNiAuMTExIDEuMjg3Qy0uMDQyIDEuMTQtLjAzNC45MS4xMTkuNzdsLjcxLS42NTJjLjE2LS4xNDcuNDItLjE0Ny41NzMgMEw1LjgyMiA0LjdjLjA3Ni4wODQuMjE0LjA5MS4zMDUuMDE0QzYuNDMzIDQuNDIgMTAuMTYyLjUwMyAxMC41OS4xMWMuMTYtLjE0Ny40MTMtLjE0Ny41NzMgMHoiLz48L3N2Zz4=');
    color: rgb(55, 55, 55);
    opacity: 0.8;
    transition: 100ms;
    display: block;
    line-height: 13px;
  }

  &:hover::after {
    opacity: 1;
  }
`;

const Loading = styled.div`
  background: rgba(221, 230, 242, 0.8);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 61px;
  height: 100vh;
  width: 100%;
  z-index: 10000;
`;

const SideNav = styled(SideNavBase)`
  // Increase specificity with double ampersand
  && {
    backdrop-filter: blur(22px);
    box-shadow: 8px 0 16px 0 rgba(35, 82, 163, 0.15);
    background: rgba(238, 240, 245, 0.45);
    position: fixed;
    width: 60px;
    top: 0;
    height: 100%;
    z-index: 100000;

    > *:first-of-type {
      border: none;
    }

    > div {
      svg {
        display: none;
      }
      background: url(${teslaIcon}) no-repeat center;

      @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
        background: url(${teslaIconX2}) no-repeat center;
        background-size: 80%;
      }
    }
  }
`;

const NavListItem = styled(NavListItemBase)<{ isActive: boolean }>`
  // Increase specificity with double ampersand
  && {
    font: 16px ${({ theme }) => theme.fonts.iconFont};
    position: relative;
    min-height: 64px;
    border: none;
    opacity: ${({ isActive }) => (isActive ? 1 : 0.4)};
    transition: 200ms ease;

    &:hover {
      background: transparent;
      color: #222c39;
      opacity: 1;
    }

    // Right vertical line
    &::after {
      content: '';
      background: #222c39;
      position: absolute;
      right: 0;
      width: ${({ isActive }) => (isActive ? '1px' : 0)};
      height: 42px;
      transition: 100ms ease;
    }

    > * {
      margin: auto !important;
    }
  }
`;

const Form = styled.div`
  max-width: 630px;
  padding: 0 26px;
  box-sizing: content-box;
`;

const Fieldset = styled.div`
  margin-bottom: 52px;

  &:last-of-type {
    margin-bottom: 0;
  }
`;

const FieldsetLegend = styled.h4`
  color: var(--color-marine);
  font-size: 16px;
  font-weight: 500;
  line-height: 1;
  padding-bottom: 16px;
  margin-bottom: 30px;
  position: relative;

  &::after {
    background: linear-gradient(
      to left,
      transparent 60%,
      var(--color-steel) 0%
    );
    background-size: 6px 1px;
    content: '';
    height: 1px;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    opacity: 0.5;
  }
`;

const FieldsetRow = styled.div<{ columns: number }>`
  display: grid;
  grid-template-columns: repeat(
    ${({ columns }) => columns},
    minmax(160px, 1fr)
  );
  grid-gap: 40px 28px;
`;

const Label = styled.label<{ error?: string | null }>`
  color: var(--color-marine);
  font-size: 12px;
  text-transform: uppercase;
  display: block;
  position: relative;

  > * {
    margin-top: 8px;
  }
`;

const Error = styled.div`
  color: var(--color-copper);
  display: block;
  font-size: 12px;
  line-height: 1.5;
  margin-top: 2px;
  position: absolute;
  text-transform: none;
`;

const Input = styled.input<{ isInvalid?: boolean }>`
  height: 40px;
  border-radius: 8px;
  backdrop-filter: blur(4px);
  box-shadow: 4px 8px 10px 0 rgba(144, 180, 197, 0.3),
    -8px -8px 16px 0 rgba(174, 174, 192, 0.13),
    inset 8px 8px 14px 0 rgba(175, 204, 213, 0.26),
    inset 8px 8px 14px 0 rgba(255, 255, 255, 0.28);
  border: solid 1px var(--color-pale-grey);
  background: rgba(255, 255, 255, 0.4);
  padding: 12px;
  font-family: inherit;
  font-size: 14px;
  width: 100%;
  color: var(
    ${({ isInvalid }) => (isInvalid ? '--color-copper' : '--color-marine')}
  );

  &::placeholder {
    opacity: 0.5;
    font-family: Jost, sans-serif;
    font-size: 14px;
    color: var(--color-marine);
    line-height: 20px; // Safari fix
  }
`;

const Select = styled.div`
  color: var(--color-marine);
  cursor: var(--cursor-base64-url) 12 12, auto;
  font-size: 14px;
  position: relative;
  text-transform: none;
  user-select: none;
`;

const SelectCurrent = styled.div<{ isValueSet: boolean; isOpen: boolean }>`
  height: 40px;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 8px;
  backdrop-filter: blur(4px);
  box-shadow: 4px 8px 10px 0 rgba(144, 180, 197, 0.3),
    -8px -8px 16px 0 rgba(174, 174, 192, 0.13),
    inset 8px 8px 14px 0 rgba(175, 204, 213, 0.26),
    inset 8px 8px 14px 0 rgba(255, 255, 255, 0.28);
  border: solid 1px var(--color-pale-grey);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  color: ${({ isValueSet }) =>
    isValueSet ? 'var(--color-marine)' : 'rgba(9, 53, 72, 0.5)'};

  &:active {
    background: rgba(255, 255, 255, 0.2);
  }

  &::after {
    content: '';
    background: ${base64Svg.menuDownArrow.url} no-repeat;
    background-size: contain;
    width: 5px;
    height: 8px;
    transform: rotateZ(${({ isOpen }) => (isOpen ? -90 : 90)}deg);
  }
`;

const SelectOptionList = styled.ul<{ isOpen: boolean }>`
  border-radius: 8px;
  backdrop-filter: blur(4px);
  box-shadow: 0 0 0 1px #eef4fa, 8px 6px 15px 0 rgba(144, 180, 197, 0.57),
    -8px -8px 16px 0 rgba(174, 174, 192, 0.13),
    inset 6px 6px 17px 0 rgba(175, 204, 213, 0.26),
    inset 8px 8px 14px 0 rgba(255, 255, 255, 0.28);
  background: rgba(232, 239, 246, 0.75);
  cursor: var(--cursor-base64-url) 12 12, auto;
  position: absolute;
  top: calc(100% + 10px);
  max-height: ${({ isOpen }) => (isOpen ? '200' : 0)}px;
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  overflow-y: hidden;
  left: 1px;
  right: 1px;
  z-index: 1;
  transition: 200ms ease-in-out;

  &:hover {
    overflow-y: auto;
  }

  &::-webkit-scrollbar {
    width: 4px;
    height: 83px;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--color-marine);
    border-radius: 4px;
  }
`;

const SelectOptionItem = styled.li<{ isCurrent: boolean }>`
  color: var(--color-marine);
  height: 40px;
  line-height: 40px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 16px 0 24px;
  font-weight: ${({ isCurrent }) => (isCurrent ? 500 : 300)};

  &:hover {
    background: var(--color-marine);
    color: white;
    font-weight: 500;
  }
`;

const Tooltip = styled.span<{ children: string }>`
  font-size: 0;
  text-transform: none;
  display: inline-block;
  position: relative;
  margin-left: 8px;
  width: 11px;

  &::before {
    content: '${Icons.info}';
    color: var(--color-marine);
    font-family: '${Fonts.iconFont}';
    font-size: 10px;
    opacity: 0.45;
    position: absolute;
    top: -9px;
    transition: 100ms;
  }

  &:hover::before {
    opacity: 1;
  }

  &::after {
    content: '${({ children }) => children}';
    border-radius: 6px;
    width: 200px;
    backdrop-filter: blur(2px);
    box-shadow: -8px 0 16px 0 rgba(156, 156, 161, 0.11);
    background-image: linear-gradient(
      75deg,
      var(--color-dark-blue-grey),
      #296883 99%
    );
    color: white;
    padding: 8px 12px;
    font-size: 12px;
    font-weight: 500;
    line-height: 1.5;
    opacity: 0;
    position: absolute;
    left: 18px;
    top: 0;
    transform: translateY(-60%) scale(0);
    transition: opacity 200ms ease-in 200ms;
    z-index: 1;
  }

  &:hover::after {
    opacity: 0.6;
    transform: translateY(-60%) scale(1);
  }
`;

const Modal = styled.div<{ isVisible: boolean }>`
  color: white;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 100000;
  transition: opacity 200ms ease-in,
    transform 0ms linear ${({ isVisible }) => (isVisible ? 0 : 200)}ms;
  transform: ${({ isVisible }) => (isVisible ? 'scale(1)' : 'scale(0)')};
  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
`;

const ModalBackdrop = styled.div`
  backdrop-filter: blur(14px);
  background: rgba(0, 31, 51, 0.43);
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
`;

const ModalPane = styled.div`
  font-family: 'Jost', sans-serif;
  max-width: 400px;
  margin: auto;
  position: relative;
  text-align: center;
  top: 40%;
  transform: translateY(-50%);
`;

const ModalTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 36px;
  line-height: 1.5;
`;

const ModalContent = styled.div`
  line-height: 1.3;
`;

const ModalActions = styled.div`
  margin-top: 58px;
  display: flex;
  justify-content: space-evenly;
  text-transform: uppercase;
`;

const ModalButton = styled.span`
  border-radius: 20px;
  border: solid 1px transparent;
  color: white;
  cursor: var(--cursor-base64-url) 12 12, auto;
  font-size: 18px;
  font-weight: 600;
  height: 40px;
  line-height: 38px;
  min-width: 93px;
  text-align: center;
  transition: 100ms linear;
  user-select: none;

  &:hover {
    backdrop-filter: blur(9px);
    background: rgba(255, 255, 255, 0.45);
    box-shadow: 8px 6px 15px 0 rgba(144, 180, 197, 0.57),
      -2px -2px 7px 0 #f0f0f3, -8px -8px 16px 0 rgba(174, 174, 192, 0.13),
      inset 6px 6px 17px 0 rgba(175, 204, 213, 0.26),
      inset 8px 8px 14px 0 rgba(255, 255, 255, 0.28);
    border-color: var(--color-pale-grey);
    color: var(--color-dark-blue-grey);
  }

  &:active {
    background: rgba(255, 255, 255, 0.35);
    box-shadow: none;
  }
`;

const Button = styled.button<{
  backgroundColor?: string;
  big?: boolean;
  border?: string;
  contentColor?: string;
  cursor?: string;
  main?: boolean;
}>`
  ${({ backgroundColor, border, contentColor, main }) =>
    main
      ? `
        background-color: ${backgroundColor || '#222A38'};
        border: ${
          border ||
          (backgroundColor
            ? `1px solid ${backgroundColor}`
            : '1px solid #222A38')
        };
        color: ${contentColor || 'white'};
        font-weight: 600;
        transition: background-color 0.1s ease-in, border 0.1s ease-in, color 0.1s ease-in;
      `
      : `
        background-color: ${backgroundColor || '#F5F7FB'};
        border: ${
          border ||
          (backgroundColor
            ? `1px solid ${backgroundColor}`
            : '1px solid #F5F7FB')
        };
        color: ${contentColor || '#093548'};
        font-weight: 400;
      `}

  ${({ big }) =>
    big
      ? `
        padding: 0 24px;
      `
      : `
        padding: 0 24px;
      `}

  border-radius: 8px;
  cursor: ${({ cursor }) => cursor || 'pointer'};
  font-family: 'Jost', sans-serif;
  font-size: 0.875rem;
  height: 48px;
  line-height: 1.125rem;
  margin: 0 6px;
  padding-block: 15px;
  padding-inline: ${({ big }) => (big ? '40px' : '20px')};
`;

export default {
  Dashboard,
  Stage,
  Loading,
  SideNav,
  NavListItem,
  NavListItemIcon,
  Notification,
  NotificationTitle,
  NotificationMessage,
  NotificationBody,
  NotificationClose,
  Form,
  Fieldset,
  FieldsetLegend,
  FieldsetRow,
  Label,
  Error,
  Input,
  Select,
  SelectCurrent,
  SelectOptionList,
  SelectOptionItem,
  Tooltip,
  Modal,
  ModalBackdrop,
  ModalPane,
  ModalTitle,
  ModalContent,
  ModalActions,
  ModalButton,
  Button
};
