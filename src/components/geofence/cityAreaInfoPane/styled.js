import styled from '@emotion/styled/macro';

import { Fonts } from '@thebeatapp/beat-ui';
import { base64Svg } from '../../svgs';

export const ExpandableContainer = styled.div`
  max-height: ${({ isExpanded, compactView, showPercentages }) =>
    !isExpanded && compactView && !showPercentages ? '73px' : '500px'};

  height: ${({ isExpanded, showPercentages }) =>
    !isExpanded && showPercentages ? '120px' : '73'};

  margin-bottom: 5px;
  overflow: hidden;
  transition: max-height 0.5s ease;
`;

export const ExpandButton = styled.span`
  font: 10px 'Jost', sans-serif;
  font-weight: 600;
  cursor: pointer;

  &::after {
    display: inline-block;
    content: 'e';
    font: 7px '${Fonts.iconFont}';
    margin-left: 5px;
    transform: ${({ isExpanded }) =>
      !isExpanded ? 'rotate(90deg)' : 'rotate(-90deg)'};
  `;

const Icon = styled.span`
  margin-bottom: ${({ longText }) => longText && 13}px;
  &::before {
    ${({ icon }) => `--${icon}-icon-base64-url: ${base64Svg[icon].url}`};
    display: inline-block;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0;
    content: ${({ icon }) => `var(--${icon}-icon-base64-url)`};
    width: 26px;
    height: 26px;
    margin-right: 8px;
    border-radius: 4px;
    line-height: 1;
  }
`;

const PercentageBox = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  right: 0;
  width: 60px;
  height: 25px;
  top: 3px;
  opacity: 1;
  font: 11px 'Jost', sans-serif;
  font-weight: 500;
  border-radius: 4px;
  backdrop-filter: blur(6px);
  justify-content: flex-start;
  background-color: rgba(41, 104, 131, 0.15);
  ${({ direction }) =>
    direction === 'down' &&
    `
      background-color: rgba(190, 72, 36, 0.24);
      color: rgba(99, 54, 48, 0.8);
    `}

  &::before {
    --green-arrow-icon-base64-url: ${base64Svg.greenArrow.url};
    --red-arrow-icon-base64-url: ${base64Svg.redArrow.url};
    content: var(--green-arrow-icon-base64-url);
    margin-right: 5px;
    margin-left: 6px;
    ${({ direction }) =>
      direction === 'down' &&
      `
      transform: rotate(180deg);
      content: var(--red-arrow-icon-base64-url);
    `}
  }
`;

const Content = styled.div`
  width: ${({ showPercentages }) => (showPercentages ? 236 : 214)}px;
  padding: 16px;
  font: 12px 'Jost', sans-serif;
  color: ${({ isLightSkin }) => (isLightSkin ? '#222a38' : '#fff')};
  border-radius: 8px;
  pointer-events: all;
  box-shadow: ${({ compactView }) =>
    compactView
      ? '-8px 0 16px 0 rgba(156, 156, 161, 0.2), 8px 0 16px 0 rgba(106, 167, 217, 0.2)'
      : '-8px 0 16px 0 rgba(156, 156, 161, 0.11)'};
  backdrop-filter: blur(8px);

  ${({ isLightSkin }) =>
    isLightSkin
      ? `background-color: rgba(238, 240, 245, .6);`
      : `background-image: linear-gradient(42deg, rgba(19, 36, 65, 0.45), rgba(41, 104, 131, .5) 99%);`};
  z-index: 2;

  ${PercentageBox} {
    color: ${({ isLightSkin, direction }) =>
      isLightSkin ? 'rgba(9, 53, 72, 0.8)' : '#fff'};

    &::before {
      content: ${({ isLightSkin }) =>
        !isLightSkin && `var(--white-arrow-icon-base64-url)`};
    }
  }

  ${Icon} {
    &::before {
      ${({ isLightSkin }) =>
        isLightSkin
          ? `background-color: rgba(19, 36, 65, 0.06)`
          : `filter: brightness(100); background-color: rgba(255, 255, 255, 0.11);`};
    }
  }

  ${({ compactView }) =>
    compactView &&
    `
    ${Icon} {
      &::before {
        width: auto;
        height: auto;
        background: none!important;
      }
    }
  `};
`;

const Group = styled.div`
  display: flex;
  align-items: center;
  align-self: flex-start;
  margin-bottom: 10px;
`;

const InnerGroup = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 84px;
  margin-right: -20px;
`;

const DistrictName = styled.h3`
  font-weight: 600;
  line-height: 1;
  font-size: 14px;
`;

const DistrictNameSubtitle = styled.p`
  margin-bottom: 10px;
  font-size: 11px;
`;

const Subtitle = styled.p`
  font-size: 12px;
  font-weight: 600;
  margin-top: -3px;
`;

const Title = styled.span`
  width: ${({ longText }) => longText && '70%'};
  font-size: 11px;
  ${Subtitle} {
    display: inline-block;
    font-size: 10px;
    margin-right: 3px;
  }
`;

const InnerSubtitle = styled.span`
  font-weight: 500;
`;

export default {
  Content,
  Group,
  InnerGroup,
  DistrictName,
  DistrictNameSubtitle,
  ButtonWrapper,
  Title,
  Subtitle,
  Icon,
  PercentageBox,
  InnerSubtitle,
  ExpandButton,
  ExpandableContainer
};
