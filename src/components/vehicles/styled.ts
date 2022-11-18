import styled from '@emotion/styled/macro';
import { css } from '@emotion/core';
import { Dropdown as DropdownBase } from '@thebeatapp/beat-ui';

import { ReactComponent as EmptyResultsSvg } from '../../assets/empty-results.svg';
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
  --color-copper: #be4824;
  --color-dusk: #413f60;
  --color-steel: #858c97;
  --color-steel-two: #7f899b;
  --color-steel-60: rgba(108, 122, 145, 0.6);
  --color-cornflower-blue-20: rgba(106, 167, 217, 0.2);
  --color-tealish: #23d2aa;
  --color-battleship-grey: #66667e;
  --color-marine: #093548;
  --color-very-light-pink: #fdeee9;
  --color-ice-blue: #f7fffe;
  --color-bright-light-blue-14: rgba(51, 231, 240, 0.14);
  --switch-width: 217px;
  --switch-slider-width-left: 99px;
  --switch-slider-width-right: calc(217px - 99px);
  --switch-padding: 6px;
  --cursor-base64-url: ${base64Svg.cursor.url};
`;

const View = styled.div`
  ${vars};
  font-family: 'Jost', sans-serif;
  height: 100%;
  position: relative;
`;

const Stage = styled.section`
  background: ${base64Svg.gradient.url} top / cover;
  display: flex;
  flex-flow: column;
  padding: 24px 40px;
  position: absolute;
  bottom: 0;
  top: 0;
  left: 0;
  right: 0;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 46px;
  line-height: 46px;
  margin-bottom: 65px;
`;

const HeaderTitle = styled.h1`
  color: var(--color-marine);
  font-size: 24px;
  font-weight: 700;
  flex: 1;

  > a {
    line-height: 26px;

    &::before {
      content: ${base64Svg.backArrow.url};
      margin-right: 12px;
      margin-top: -2px;
    }
  }
`;

const DataTable = styled.div`
  display: flex;
  font: 14px 'Jost', sans-serif;
  flex: 1;
  flex-flow: column;
  overflow: auto;
  padding: 0 20px 0 14px;
  margin: 0 -20px 0 -14px;
`;

const DataTableColumn = styled.div`
  white-space: nowrap;
  margin-right: 7px;

  &:first-of-type {
    flex-basis: 8.9%;
  }

  &:nth-of-type(2) {
    flex-basis: 8.8%;
  }

  &:nth-of-type(3) {
    flex-basis: 8.5%;
  }

  &:nth-of-type(4) {
    flex-basis: 10.2%;
  }

  &:nth-of-type(5) {
    flex-basis: 15.3%;
  }

  &:nth-of-type(6) {
    flex-basis: 13%;
  }

  &:nth-of-type(7) {
    flex-basis: 16.1%;
  }

  &:last-of-type {
    margin-right: 0;
  }
`;

const DataTableHead = styled.div`
  color: var(--color-battleship-grey);
  display: flex;
  font-size: 12px;
  padding: 11px 24px 10px;

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
  padding: 0 20px 0 14px;
  margin: 0 -20px 0 -14px;
`;

const DataTableRow = styled.div<{ index: number }>`
  backdrop-filter: blur(3px);
  background: rgba(255, 255, 255, 0.5);
  box-shadow: 6px 6px 8px -6px rgba(125, 194, 231, 0.2),
    0px 8px 12px -6px rgba(174, 174, 192, 0.1);
  border-radius: 4px;
  display: flex;
  align-items: center;
  padding: 16px 24px;
  position: relative;
  transition: 100ms;
  z-index: ${({ index }) => 9999 - index};

  & + * {
    margin-top: 12px;
  }

  &:hover {
    box-shadow: 6px 6px 16px 0 rgba(125, 194, 231, 0.3),
      8px 8px 24px 0 rgba(174, 174, 192, 0.2);
  }
`;

const Search = styled.div`
  width: 284px;
  height: 46px;
  border-radius: 23px;
  box-shadow: 6px 6px 17px 0 rgba(125, 194, 231, 0.43);
  border: solid 1px #f2f2f4;
  background: rgba(255, 255, 255, 0.4);
  display: flex;
  align-items: center;
  padding: 4px;
`;

const SearchInput = styled.input`
  background: transparent;
  border: none;
  flex: 1;
  height: 100%;
  padding: 0 12px;
  caret-color: var(--color-steel);
  font: 16px 'Jost';

  &::placeholder {
    color: var(--color-steel);
    font-size: 12px;
    font-style: italic;
    position: relative;
    top: -2px;
    line-height: 28px; // Safari fix
  }
`;

const SearchButton = styled.span<{ asReset: boolean }>`
  backdrop-filter: blur(2px);
  border-radius: 50%;
  box-shadow: 8px 8px 14px 0 rgba(174, 174, 192, 0.57),
    inset -8px -8px 14px 0 rgba(255, 255, 255, 0.9),
    inset 8px 8px 14px 0 rgba(255, 255, 255, 0.5);
  border: solid 1px #f2f2f4;
  background: var(--color-light-grey);
  display: block;
  cursor: var(--cursor-base64-url) 12 12, auto;
  width: 38px;
  height: 38px;
  transition: box-shadow 100ms linear;

  &::before {
    content: url('data:image/svg+xml;base64,${({ asReset }) =>
      asReset
        ? `PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgdmlld0JveD0iMCAwIDEwIDEwIj4KICAgIDxkZWZzPgogICAgICAgIDxyYWRpYWxHcmFkaWVudCBpZD0iZWdyYnE5c2E3YSIgY3g9IjUwJSIgY3k9Ii0xMi40ODIlIiByPSIxMzUuODA2JSIgZng9IjUwJSIgZnk9Ii0xMi40ODIlIiBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDAgMSAtLjk2NyAwIC4zOCAtLjYyNSkiPgogICAgICAgICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjMjk2ODgzIi8+CiAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzEzMjQ0MSIvPgogICAgICAgIDwvcmFkaWFsR3JhZGllbnQ+CiAgICA8L2RlZnM+CiAgICA8cGF0aCBmaWxsPSJ1cmwoI2VncmJxOXNhN2EpIiBkPSJNMjYxLjc4NiAxOC4yMTRjLS4yODYtLjI4NS0uNzE1LS4yODUtMSAwTDI1NyAyMmwtMy43ODYtMy43ODZjLS4yODUtLjI4NS0uNzE0LS4yODUtMSAwLS4yODUuMjg2LS4yODUuNzE1IDAgMUwyNTYgMjNsLTMuNzg2IDMuNzg2Yy0uMjg1LjI4NS0uMjg1LjcxNCAwIDEgLjE0My4xNDMuMjg2LjIxNC41LjIxNC4yMTUgMCAuMzU3LS4wNzEuNS0uMjE0TDI1NyAyNGwzLjc4NiAzLjc4NmMuMTQzLjE0My4zNTcuMjE0LjUuMjE0LjE0MyAwIC4zNTctLjA3MS41LS4yMTQuMjg1LS4yODYuMjg1LS43MTUgMC0xTDI1OCAyM2wzLjc4Ni0zLjc4NmMuMjg1LS4yODUuMjg1LS43MTQgMC0xIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjUyIC0xOCkiLz4KPC9zdmc+Cg==`
        : `PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMiIgaGVpZ2h0PSIxMiIgdmlld0JveD0iMCAwIDEyIDEyIj4KICAgIDxkZWZzPgogICAgICAgIDxyYWRpYWxHcmFkaWVudCBpZD0idDlueHY5Nmo3YSIgY3g9IjUwJSIgY3k9Ii0xMi40ODIlIiByPSIxMzUuODA2JSIgZng9IjUwJSIgZnk9Ii0xMi40ODIlIiBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDAgMSAtLjk2NyAwIC4zOCAtLjYyNSkiPgogICAgICAgICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjMjk2ODgzIi8+CiAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzEzMjQ0MSIvPgogICAgICAgIDwvcmFkaWFsR3JhZGllbnQ+CiAgICA8L2RlZnM+CiAgICA8cGF0aCBmaWxsPSJ1cmwoI3Q5bnh2OTZqN2EpIiBkPSJNMjU2LjMyNSAyNi4wMTljLTIuMSAwLTMuODI1LTEuNjQtMy44MjUtMy43MjcgMC0yLjA4NyAxLjcyNS0zLjgwMSAzLjgyNS0zLjgwMXMzLjgyNSAxLjcxNCAzLjgyNSAzLjhjMCAyLjA4OC0xLjcyNSAzLjcyOC0zLjgyNSAzLjcyOHptNC4yLS41OTdjLjY3NS0uODk0IDEuMDUtMS45MzggMS4wNS0zLjEzIDAtMi45MDctMi4zMjUtNS4yOTItNS4yNS01LjI5MlMyNTEgMTkuMzg1IDI1MSAyMi4yOTJzMi40IDUuMjkyIDUuMzI1IDUuMjkyYzEuMiAwIDIuMzI1LS4zNzMgMy4xNS0xLjA0NGwyLjI1IDIuMjM2Yy4xNS4xNS4zNzUuMjI0LjUyNS4yMjQuMTUgMCAuMzc1LS4wNzUuNTI1LS4yMjQuMy0uMjk4LjMtLjc0NSAwLTEuMDQzbC0yLjI1LTIuMzF6IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjUxIC0xNykiLz4KPC9zdmc+Cg==`}');
    display: block;
    text-align: center;
    line-height: 38px;
  }

  &:active {
    box-shadow: none;
  }
`;

const PlusButton = styled.span`
  border: solid 1px #f2f2f4;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 50%;
  box-shadow: 6px 6px 17px 0 rgba(125, 194, 231, 0.43);
  color: var(--color-dark-blue-grey);
  display: flex;
  font: 14px/40px 'Jost', sans-serif;
  width: 48px;
  height: 48px;
  padding: 4px;
  box-sizing: border-box;
  user-select: none;
  position: relative;
  cursor: var(--cursor-base64-url) 12 12, auto !important;

  &::before {
    content: ${base64Svg.plus.url};
    background: #eff2f2;
    backdrop-filter: blur(2px);
    box-shadow: 8px 8px 14px 0 rgba(174, 174, 192, 0.57),
      inset -8px -8px 14px 0 rgba(255, 255, 255, 0.9),
      inset 8px 8px 14px 0 rgba(255, 255, 255, 0.5);
    border: solid 1px #f2f2f4;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 1px;
    position: absolute;
    top: 4px;
    left: 4px;
    right: 4px;
    bottom: 4px;
    transition: 100ms linear;
  }

  &:hover::before {
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
  }

  &:active::before {
    box-shadow: none;
  }

  * + & {
    margin-left: 24px;
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
    z-index: 10000;

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
        white-space: nowrap;

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
  z-index: 10000;

  .beat-ui-dropdown-selected *:first-of-type::before {
    content: ${base64Svg.menuDownArrowSmall.url};
    margin-right: 4px;
  }

  & + * {
    margin-left: 20px;
  }
`;

const EmptyResults = styled.div`
  color: var(--color-marine);
  margin: 75px auto;
  max-width: 400px;
  text-align: center;
`;

const EmptyResultsGfx = styled<any>(EmptyResultsSvg)`
  margin-bottom: 32px;
`;

const EmptyResultsTitle = styled.h3`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 16px;
`;

const EmptyResultsText = styled.p`
  font-size: 16px;
  font-weight: 400;
  line-height: 1.3;
`;

const Submit = styled.button`
  background: var(--color-dark);
  border-radius: 4px;
  border-style: none;
  color: white;
  cursor: var(--cursor-base64-url) 12 12, auto;
  font: 600 14px 'Jost';
  line-height: 21px;
  min-width: 127px;
  padding: 16px;
  position: relative;
  transition: 100ms;
  right: -22px;

  &:active {
    opacity: 0.85;
  }
`;

const Sub = styled.sub`
  font-size: 12px;
  font-weight: 400;
  margin-left: 12px;
  vertical-align: middle;
`;

const EditItemButton = styled.span<any>`
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  margin-left: auto;
  opacity: 0;
  position: relative;
  width: 40px;
  cursor: pointer;

  &::before {
    background: ${base64Svg.edit.url} no-repeat center;
    content: '';
    height: 20px;
    width: 20px;
  }

  &::after {
    border: 12px solid transparent;
    border-radius: 50%;
    content: '';
    position: absolute;
    transition: 150ms linear;
  }

  ${DataTableRow}:hover & {
    opacity: 1;
  }

  &:hover::after {
    border-width: 20px;
    border-color: var(--color-bright-light-blue-14);
  }

  &:active {
    transform: scale(0.8);
    transition: 100ms;
  }

  &:active::after {
    border-color: transparent;
  }
`;

export default {
  View,
  Stage,
  Header,
  HeaderTitle,
  DataTable,
  DataTableHead,
  DataTableBody,
  DataTableRow,
  DataTableColumn,
  Search,
  SearchInput,
  SearchButton,
  PlusButton,
  EditItemButton,
  CityDropdown,
  EmptyResults,
  EmptyResultsGfx,
  EmptyResultsTitle,
  EmptyResultsText,
  Submit,
  Sub
};
