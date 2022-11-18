import styled from '@emotion/styled';
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter
} from '@thebeatapp/beat-ui';
import { base64Svg } from '../svgs';

const MapGradient = styled.div`
  width: calc(100% - 60px);
  height: 100%;
  background-image: linear-gradient(to bottom, #dde6f27d 0%, #f2f6fa00);
  position: absolute;
  z-index: 6;
  pointer-events: none;

  &::after {
    content: '';
    position: absolute;
    width: 160px;
    height: 100%;
    right: 0;
    background-image: linear-gradient(to left, #d7dde2 0%, #15508c00);
  }

  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 108px;
    bottom: 0;
    background-image: linear-gradient(to top, #f2f6faa6 0%, #dde6f221);
  }
`;

const TimelineContainer = styled.div`
  position: absolute;
  margin: 0 0 0 auto;
  height: 95%;
  right: 0;
  z-index: 6;
`;

const Timeline = styled.ul`
  width: 76px;
  height: 100%;
  list-style: none;
  box-sizing: border-box;
  padding: 100px 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const ParentNode = styled.li`
  position: relative;
  width: 100%;
  font-size: 12px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  transition: all 0.25s ease-in-out;

  &::before {
    content: '';
    width: 39px;
    height: 1px;
    background-image: linear-gradient(
      83deg,
      rgba(19, 36, 65, 0.45),
      rgba(41, 104, 131, 0.45) 99%
    );
  }

  &::after {
    position: absolute;
    content: '${({ day }) => `${day}`}';
    font: 12px 'Jost', sans-serif;
    color: #8b97a8;
    top: 2px;
    left: ${({ isWeekNode }) => (isWeekNode ? '-68px' : 0)};
    transform: translateY(-50%);
  }
`;

const CurrentNode = styled(ParentNode)`
  cursor: pointer;
  &::after {
    position: absolute;
    content: 'NOW';
    font: 12px 'Jost', sans-serif;
    color: #8b97a8;
    top: 2px;
    left: 0;
    transform: translateY(-50%);
    transition: all 0.25s ease-in-out;
  }

  ${({ isActiveNode }) =>
    isActiveNode &&
    `
      &::before {
        content: '';
        width: 65px;
        height: 4px;
        background-image: linear-gradient(86deg, #007c86, #719cae 99%);
      }
    
      &::after {
        left: -34px;
        font-weight: 600;
        color: #0c7f8a;
      }
  `}
`;

const ChildNode = styled.span`
  position: relative;
  display: block;
  height: 4px;
  cursor: pointer;
  transition: all 0.25s ease-in-out;
  padding: 3px 0;

  margin: 8px 0 2px 0;

  &:not(:first-of-type) {
    margin: 2px 0;
  }

  &.active {
    cursor: grabbing;
    cursor: -webkit-grabbing;
    transform: scale(1);
  }

  &:hover,
  &.isSelected {
    &::before {
      width: 42px;
      height: 4px;
      background-image: linear-gradient(85deg, #007c86, #719cae 99%);
    }

    &::after {
      position: absolute;
      content: '${({ date }) => date}';
      top: 5px;
      left: -125px;
      transform: translateY(-50%);
      font: 12px 'Jost', sans-serif;
      font-weight: 500;
      color: #0c7f8a;
    }
  }

  &::before {
    display: block;
    content: '';
    width: 22px;
    height: 1px;

    background-image: linear-gradient(
      87deg,
      #017c86,
      rgba(41, 104, 131, 0.45) 99%
    );
    transition: all 0.25s ease-in-out;
  }
`;

const HistoryMapContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
  margin: auto;
  opacity: 1;
  z-index: 5;
  transition: opacity 0.25s ease-in-out;

  ${({ isLoading }) => isLoading && `opacity: .2;`}
`;

const HistoryMap = styled.div`
  width: 100%;
  height: 100%;
  box-shadow: 0 7px 21px 0 rgba(97, 114, 131, 0.24);
  z-index: 5;
`;

const RevertButton = styled(Button)`
  && {
    position: absolute;
    width: 89px;
    height: 54px;
    bottom: 15px;
    right: 15px;
    font-size: 14px;
    color: #fff;
    background-color: #222a38;
    font-weight: 600;
    border-radius: 4px;
    border: none;
    z-index: 6;
    cursor: pointer;

    &:hover {
      background-color: rgba(13, 16, 22, 0.3) !important;
    }

    &:disabled {
      color: #fff;
      background-color: rgba(13, 16, 22, 0.3);
    }
  }
`;

const InfoBar = styled.div`
  position: absolute;
  left: 92px;
  bottom: 32px;
  margin-top: 10px;
  align-self: start;
  font: 12px 'Jost', sans-serif;
  color: #093548;
  z-index: 6;
`;

const Info = styled.span`
  font-weight: 500;
  font-style: italic;
  &:not(:last-of-type) {
    &::after {
      content: '/';
      margin: 0 8px;
      font-weight: 300;
    }
  }
`;

const Title = styled.span`
  font-style: italic;
`;

const Dialog = styled(Modal)`
  && {
    background: transparent;
    box-shadow: none;
    font-family: 'Jost', sans-serif;
    width: 550px;

    .modal-close {
      display: none;
    }
  }
`;

const Header = styled(ModalHeader)`
  && {
    color: #fff;
    font-size: 24px;
    font-weight: bold;
    font-family: 'Jost', sans-serif;
  }
`;

const Content = styled(ModalContent)`
  && {
    color: #fff;
    font-size: 17px;
    font-weight: 400;
    font-family: 'Jost', sans-serif;
  }
`;

const Footer = styled(ModalFooter)`
  && {
    color: #fff;
    display: flex;
    justify-content: space-evenly;
  }
`;

const ConfirmButton = styled(Button)`
  && {
    width: 93px !important;
    height: 40px !important;
    font-family: 'Jost', sans-serif;
    background: none;
    border-radius: 20px;
    transition: 100ms ease;

    &:hover {
      --cursor-base64-url: ${base64Svg.cursor.url};
      transition: 100ms ease;
      box-shadow: 8px 6px 15px 0 rgba(144, 180, 197, 0.57),
        -2px -2px 7px 0 #f0f0f3, -8px -8px 16px 0 rgba(174, 174, 192, 0.13),
        inset 6px 6px 17px 0 rgba(175, 204, 213, 0.26),
        inset 8px 8px 14px 0 rgba(255, 255, 255, 0.28);
      backdrop-filter: blur(9px);
      border: solid 1px #f2f2f4;
      background-color: rgba(255, 255, 255, 0.45) !important;
      color: #132441;
      cursor: var(--cursor-base64-url) 12 12, auto !important;
    }
  }
`;

export default {
  TimelineContainer,
  Timeline,
  ParentNode,
  ChildNode,
  CurrentNode,
  HistoryMapContainer,
  HistoryMap,
  RevertButton,
  InfoBar,
  Title,
  Info,
  Dialog,
  Header,
  Content,
  Footer,
  ConfirmButton,
  MapGradient
};
