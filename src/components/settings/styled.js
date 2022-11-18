import styled from '@emotion/styled/macro';
import { Dropdown } from '@thebeatapp/beat-ui';

const Stage = styled.div`
  background: ${({ theme }) => theme.colors.white100};
  color: ${({ theme }) => theme.colors.navy100};
  padding: 7.5% 7.5% 48px;
  height: 100%;
`;

const Header = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.navy75};
  display: flex;
  margin-bottom: 70px;
  padding-right: 21px;
  position: relative;
`;

const HeaderLeft = styled.div`
  flex-grow: 1;
`;

const HeaderRight = styled.div`
  display: flex;
  flex-flow: column;
  justify-content: center;

  &::before {
    content: 'Select City';
    display: block;
    line-height: 17px;
    margin-top: -4px;
    margin-bottom: 4px;
  }
`;

const LastUpdate = styled.div`
  font: 12px ${({ theme }) => theme.fonts.mono};
  position: absolute;
  right: 21px;
  bottom: -21px;
`;

const HeaderTitle = styled.h1`
  font: 32px ${({ theme }) => theme.fonts.bold};
  text-transform: uppercase;
  margin-bottom: 8px;
`;

const Sections = styled.div``;

const Fieldset = styled.div`
  padding-bottom: 70px;
  padding-right: 21px;

  &:not(:last-of-type) {
    border-bottom: 1px solid ${({ theme }) => theme.colors.navy75};
  }

  & + & {
    padding-top: 80px;
  }
`;

const Legend = styled.div`
  color: ${({ theme }) => theme.colors.navy75};
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
  position: relative;
`;

const Title = styled.h2`
  font: 24px/28px ${({ theme }) => theme.fonts.bold};
  margin-left: -2px;
  margin-right: 125px;
  text-transform: uppercase;
  flex-grow: 1;
`;

const Label = styled.label`
  display: flex;
  margin-bottom: 4px;

  .beat-ui-tooltip {
    opacity: 0.85;
    padding-right: 20px;
  }
`;

const Group = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(auto, 424px));
  grid-column-gap: 7%;
  grid-row-gap: 8px;
  margin-top: 10px;
`;

const FullSpan = styled.div`
  grid-column: span 2;
  margin-bottom: 24px;
`;

const Field = styled.div`
  max-width: ${({ isSmall }) => (isSmall ? '195px' : '100%')};
`;

const ExternalLink = styled.a`
  display: inline-block;
  vertical-align: top;
`;

const Description = styled.div`
  color: ${({ theme }) => theme.colors.navy50};
  display: flex;
  font-family: ${({ theme }) => theme.fonts.mono};
  line-height: 1.333; // 1.1;
  justify-content: space-between;
  max-width: 80%;
  margin-bottom: 30px;

  &:last-of-type {
    margin-bottom: 0;
  }

  ${Header} & {
    margin-bottom: 30px;
  }
`;

const InfoIcon = styled.div`
  color: ${({ theme }) => theme.colors.navy50};
  font: 12px ${({ theme }) => theme.fonts.iconFont};
  line-height: 16px;
  margin-left: 6px;

  &::before {
    content: '${({ theme }) => theme.icons.info}';
  }
`;

const Add = styled.div`
  display: inline-block;
  font: 18px/1 ${({ theme }) => theme.fonts.bold};
  text-decoration: underline;
  cursor: pointer;
  user-select: none;

  &:active {
    opacity: 0.5;
  }
`;

const Button = styled.button`
  background: ${({ theme }) => theme.colors.navy100};
  border-radius: 8px;
  border: 0;
  color: ${({ theme }) => theme.colors.white100};
  cursor: pointer;
  font: 16px/1 ${({ theme }) => theme.fonts.bold};
  padding: 12px;
  position: absolute;
  right: 0;
  text-transform: uppercase;
  user-select: none;
  transition: box-shadow 100ms ease;

  &:hover {
    box-shadow: 0 0 7px 0 rgba(0, 0, 0, 0.27);
  }

  &:active {
    background: ${({ theme }) => theme.colors.navy75};
  }
`;

const RowActions = styled.div`
  color: ${({ theme }) => theme.colors.navy10};
  display: flex;
  align-items: center;
  flex-grow: 1;
  font: 12px ${({ theme }) => theme.fonts.iconFont};
  max-height: 54px;
  transition: 100ms ease;
`;

const Action = styled.b`
  cursor: pointer;
  transition: 100ms ease;
`;

const RowDrag = styled(Action)`
  cursor: move;
  font-size: 16px;

  &:hover {
    // color: ${({ theme }) => theme.colors.navy100};
  }

  &::before {
    content: '${({ theme }) => theme.icons.handle}';
  }
`;

const RowVisibility = styled(Action)`
  --icon-visible: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='13' viewBox='0 0 16 13'%3E%3Cpath fill='%23413F60' fill-rule='evenodd' d='M9.709 7.858c-.474.46-1.043.688-1.707.688-.665 0-1.233-.229-1.707-.688-.474-.458-.71-1.009-.71-1.652s.236-1.194.71-1.652c.474-.459 1.042-.688 1.707-.688.664 0 1.233.23 1.707.688.473.458.71 1.009.71 1.652s-.237 1.194-.71 1.652m6.275-1.57c-.01-.059-.018-.092-.028-.14-.021-.096-.042-.147-.064-.22-.043-.129-.088-.242-.136-.349-.094-.213-.194-.411-.301-.6-.213-.38-.446-.738-.698-1.081-.505-.687-1.087-1.32-1.752-1.887-.664-.567-1.424-1.058-2.27-1.42-.424-.177-.869-.32-1.328-.424C8.947.069 8.476.015 8.002 0c-.474.014-.945.069-1.406.165-.458.104-.903.247-1.328.425-.847.36-1.608.851-2.272 1.418-.665.566-1.248 1.2-1.753 1.887-.253.344-.486.7-.698 1.081-.107.19-.207.387-.302.601-.047.107-.092.221-.136.35-.021.073-.042.123-.063.22-.01.048-.019.081-.028.141-.007.055-.012.11-.015.165v.088c.004.055.009.11.017.165.01.06.018.092.029.14.022.097.043.147.066.22.045.128.092.24.14.347.099.212.201.408.311.595.219.376.458.728.715 1.066.515.675 1.107 1.295 1.777 1.844.668.55 1.43 1.02 2.267 1.358.42.167.858.298 1.308.39.451.086.911.13 1.371.134.46-.004.92-.048 1.371-.133.45-.093.888-.225 1.308-.391.837-.34 1.597-.81 2.264-1.361.671-.548 1.263-1.167 1.778-1.842.258-.338.497-.69.715-1.066.11-.187.212-.384.31-.595.048-.107.095-.22.14-.347.023-.073.044-.123.065-.22.01-.047.02-.08.03-.14.007-.054.013-.109.016-.164v-.088c-.003-.055-.008-.11-.015-.164'/%3E%3C/svg%3E");
  --icon-hidden: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='13' viewBox='0 0 16 13'%3E%3Cpath fill='%23413F60' fill-rule='evenodd' d='M14.014 6.634c-.063.134-.137.277-.222.419-.168.284-.363.567-.575.838-.424.543-.916 1.044-1.458 1.476-1.088.858-2.403 1.41-3.757 1.402-.94.006-1.86-.26-2.698-.71L7.21 8.28c.247.079.511.12.793.12.664 0 1.233-.217 1.707-.652.473-.435.71-.958.71-1.569 0-.272-.05-.526-.144-.764l1.697-1.586c.442.363.851.77 1.212 1.213.217.265.418.544.59.824.09.14.166.28.232.414.033.066.06.129.08.181-.018.052-.042.11-.072.174M2.788 7.89c-.212-.271-.407-.554-.574-.838-.085-.142-.159-.285-.221-.419-.03-.062-.07-.118-.07-.17V6.46c.02-.052.047-.114.08-.18.066-.133.143-.274.23-.414.174-.28.375-.558.592-.823.434-.533.936-1.02 1.483-1.433 1.094-.83 2.396-1.333 3.694-1.287.793-.029 1.588.148 2.336.478L8.892 4.11c-.275-.1-.571-.152-.89-.152-.665 0-1.233.218-1.707.653-.474.435-.71.958-.71 1.568 0 .28.052.54.15.782l-1.99 1.798-.092.082c-.31-.297-.602-.614-.865-.95m13.196-1.633c-.01-.057-.018-.088-.028-.133-.021-.092-.042-.14-.063-.21-.044-.121-.09-.23-.137-.33-.095-.203-.194-.391-.301-.57-.213-.362-.446-.7-.698-1.026-.408-.527-.87-1.018-1.38-1.472l1.273-1.19c.155-.145.154-.378-.002-.522L13.89.108c-.156-.143-.41-.144-.567-.002l-1.448 1.308c-.36-.212-.74-.402-1.14-.564C10.311.68 9.866.545 9.407.446 8.947.354 8.476.302 8.002.288c-.474.014-.945.065-1.406.157-.458.099-.903.235-1.328.403-.847.342-1.608.808-2.272 1.346-.666.538-1.248 1.139-1.753 1.79-.253.327-.486.666-.698 1.027-.107.18-.207.368-.302.57-.047.102-.092.21-.136.332-.021.07-.042.118-.063.21-.01.045-.019.076-.028.133-.007.052-.012.104-.015.157v.084c.004.052.01.104.017.156.009.056.018.088.03.133.02.092.042.14.065.209.045.12.092.228.14.329.099.2.201.387.311.564.219.357.457.691.716 1.012.32.398.672.772 1.05 1.126l-1.592 1.43c-.16.143-.162.38-.004.526l.99.91c.16.145.417.144.574-.004l1.696-1.596c.418.249.86.468 1.329.648.42.158.858.282 1.308.37.451.081.911.123 1.371.127.46-.004.92-.046 1.371-.127.45-.088.888-.213 1.308-.37.837-.322 1.597-.77 2.264-1.292.67-.52 1.263-1.108 1.778-1.749.258-.32.497-.655.715-1.012.11-.177.212-.363.31-.564.048-.101.095-.208.14-.33.023-.069.044-.116.065-.208.01-.045.02-.076.03-.133.007-.051.012-.103.016-.155v-.084c-.003-.052-.008-.105-.015-.156'/%3E%3C/svg%3E");
  margin-right: 16px;
  opacity: 0.25;

  &:hover {
    opacity: 1;
  }

  &::before {
    content: var(
      ${({ isActive }) => (isActive ? '--icon-hidden' : '--icon-visible')}
    );
    width: 16px;
  }
`;

const IconInput = styled.div`
  max-width: 95px;

  .beat-ui-input {
    text-align: center;

    &::placeholder {
      text-align: left;
      font: 18px ${({ theme }) => theme.fonts.regular};
    }

    &:not(:placeholder-shown) {
      font: 24px ${({ theme }) => theme.fonts.iconFont};
    }

    &:focus {
      font: 24px ${({ theme }) => theme.fonts.iconFont};

      &::placeholder {
        visibility: hidden;
      }
    }
  }

  .beat-ui-input-error {
    display: none;
  }
`;

const Grid = styled.div`
  margin-top: 10px;
  margin-bottom: 24px;
`;

const GridBody = styled.div`
  min-height: ${({ height }) => (height ? `${height}px` : 'auto')};
`;

const GridShadowRow = styled.div`
  margin-bottom: ${({ isVisible }) => (isVisible ? '9px' : 0)};
  max-height: ${({ isVisible }) => (isVisible ? '54px' : 0)};
  width: calc(100% + 48px);
  overflow: hidden;
  transition: opacity 300ms ease;
  opacity: ${({ isVisible }) => (isVisible ? 1 : 0.4)};
  padding-left: 52px;
  margin-left: -48px;
`;

const ShadowField = styled.div`
  background: ${({ theme }) => theme.colors.greyLight};
  box-shadow: 0 0 0 1px ${({ theme }) => theme.colors.greyLight};
  border-radius: 8px;
  flex: 1;
  margin-left: 8px;
  height: 54px;

  &:first-of-type {
    max-width: 95px;
    margin-left: 0;
  }
`;

const GridFields = styled.div`
  display: flex;
  width: 100%;

  > * {
    margin-left: 8px;
    flex: 1;
  }

  ${IconInput} {
    margin-left: 4px;
  }

  // Remove 'error' styling when the offline reasons is inactive
  ${({ showAsInactive, theme }) =>
    showAsInactive &&
    `
    .beat-ui-input {
      box-shadow: 0 0 0 1px ${theme.colors.navy25};
      color: ${theme.colors.navy25};
      transition: 100ms ease;
    }
  `}

  .beat-ui-input:disabled {
    color: ${({ showAsInactive, theme }) =>
      showAsInactive ? theme.colors.navy25 : theme.colors.navy100};
    box-shadow: 0 0 0 1px ${({ theme }) => theme.colors.navy25};
    cursor: default;
  }

  .beat-ui-input-error {
    display: ${({ showAsInactive }) => (showAsInactive ? 'none' : 'block')};
    margin-top: 6px;
    white-space: nowrap;
  }
`;

const GridHeadColumn = styled.div`
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow-x: hidden;
  flex: 1;
  margin-left: 8px;

  &:first-of-type {
    max-width: 95px;
    margin-left: 48px;
  }
`;

const GridDraggableRow = styled.div`
  margin-bottom: 9px;
  position: relative;
  display: flex;
  flex-flow: row;
  margin-left: -48px;

  &.is-hidden {
    display: none;
  }

  &.is-dragged {
    ${IconInput} {
      margin-left: 52px;
    }

    .beat-ui-input {
      background: ${({ theme }) => theme.colors.greyLight};
      box-shadow: none;
      color: transparent;

      &::placeholder {
        visibility: hidden;
      }

      &:disabled {
        box-shadow: none;
        color: transparent;
      }
    }

    .beat-ui-input-error {
      display: none;
    }

    ${RowActions} {
      display: none;
    }
  }

  &.ghost {
    background: ${({ theme }) => theme.colors.white100};
    box-shadow: 0 0 12px 0 rgba(0, 0, 40, 0.2);
    padding: 16px 16px 16px 28px;
    border-radius: 8px;
    box-sizing: content-box;

    ${RowActions} {
      display: none;
    }

    &::before {
      content: '${({ theme }) => theme.icons.handle}';
      color: ${({ theme }) => theme.colors.navy100};
      font: 16px ${({ theme }) => theme.fonts.iconFont};
      position: absolute;
      top: 16px;
      left: 12px;
      height: 54px;
      display: flex;
      align-items: center;
    }
  }
`;

const Select = styled(Dropdown)`
  min-width: 170px;

  .beat-ui-dropdown-selected * {
    color: ${({ theme }) => theme.colors.navy100};
  }
`;

export default {
  Stage,
  Header,
  HeaderLeft,
  HeaderRight,
  HeaderTitle,
  Title,
  Description,
  LastUpdate,
  Sections,
  Fieldset,
  Legend,
  Label,
  Group,
  FullSpan,
  Field,
  ExternalLink,
  Grid,
  GridBody,
  GridDraggableRow,
  GridShadowRow,
  ShadowField,
  GridFields,
  GridHeadColumn,
  InfoIcon,
  Button,
  Add,
  IconInput,
  RowActions,
  RowDrag,
  RowVisibility,
  Select
};
