import styled from '@emotion/styled/macro';
import { css } from '@emotion/core';

const FilterWrap = styled.div`
  .checkbox.checked div {
    border-radius: 2px;
    background-color: #10a49f;
    border: solid 1px #11a29e;
  }
  .checkbox div {
    border-radius: 2px;
    background-color: transparent;
    width: 12px;
    height: 12px;
    min-width: 12px;
    border: solid 1px #132441;
  }
  .checkbox label {
    font-family: Jost, sans-serif;
    font-size: 14px;
    font-weight: 300;
    font-stretch: normal;
    font-style: normal;
    line-height: 1;
    letter-spacing: normal;
    color: #000000;
  }
  .checkbox div:hover {
    border: solid 1px #11a29e;
  }
  .checkbox:hover {
    cursor: pointer;
  }
  .checkbox span {
    font-size: 7px;
  }
  font-family: Jost, sans-serif;
  width: 292px;
  height: 100%;
  opacity: 1;
  position: absolute;
  -webkit-backdrop-filter: blur(14px);
  backdrop-filter: blur(14px);
  --cornflower-blue-20: rgba(106, 167, 217, 0.2);
  box-shadow: -8px 0 16px 0 rgba(156, 156, 161, 0.2),
    -8px 0 16px 0 var(--cornflower-blue-20);
  background-color: rgba(238, 240, 245, 0.45);
  right: -600px;
  z-index: 33;
  -webkit-animation: slide 0.5s forwards;
  animation: slide 0.5s forwards;
  padding-top: 40px;
  padding-left: 38px;
  padding-right: 14px;
  ${({ openFilters }) =>
    openFilters &&
    css`
      -webkit-animation: slide 0.5s forwards;
      animation: slide 0.5s forwards;
      @-webkit-keyframes slide {
        100% {
          right: 0;
        }
      }
      @keyframes slide {
        100% {
          right: 0;
        }
      }
    `}
`;

const FiltersTitle = styled.span`
  width: 50px;
  height: 21px;
  font-family: Jost, sans-serif;
  font-size: 18px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.17;
  letter-spacing: normal;
  color: #222a38;
`;

const FiltersReset = styled.span`
  width: 42px;
  height: 14px;
  font-family: Jost, sans-serif;
  font-size: 12px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.17;
  letter-spacing: normal;
  text-align: right;
  color: #139a96;
  text-decoration: underline;
  text-decoration-color: #139a96;
  &:hover {
    cursor: pointer;
  }
`;

const FiltersHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;

const FiltersCategoriesTitle = styled.div`
  width: 162px;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.5;
  letter-spacing: normal;
  color: #222a38;
  padding-bottom: 20px;
  padding-top: 31px;
`;

const FilterContainer = styled.div`
  padding-bottom: 18px;
  display: flex;
`;

const Contain = styled.div`
  position: absolute;
  cursor: pointer;
  width: 28px;
  height: 12px;
  border-radius: 6px;
  background-image: ${({ markersFilterChecked }) =>
    markersFilterChecked
      ? 'linear-gradient(to left, #242c39 0%, #10a49f)'
      : 'linear-gradient(to right, #242c39 100%, #3f6f74);'};
`;

const RingsWrap = styled.div`
  position: absolute;
  top: 50%;
  -webkit-transform: translate(-50%,-50%);
  -ms-transform: translate(-50%,-50%);
  transform: translate(-50%,-50%);
  right: ${({ markersFilterChecked }) => (markersFilterChecked ? 7 : 21)}px;
  transition: 0.4s;
}
`;

const Outer = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 30px;
  box-shadow: 6px 6px 18px 0 rgba(135, 135, 146, 0.16),
    -6px -6px 18px 0 rgba(240, 240, 243, 0.05),
    inset 0 9px 18px 0 rgba(255, 253, 253, 0.67);
  border-style: solid;
  border-image-source: linear-gradient(to bottom, #dfe0e0 0%, #d4d8d8);
  border-image-slice: 1;
  background-color: rgba(239, 242, 242, 0.14);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const Middle = styled.div`
  width: 15px;
  height: 15px;
  border-radius: 30px;
  box-shadow: 4px 4px 11px 0 rgba(174, 174, 192, 0.93),
    -4px -4px 11px 0 rgba(240, 240, 243, 0.35);
  border-style: solid;
  border-image-source: linear-gradient(to bottom, #e5e7e7 0%, #cfd1d8);
  border-image-slice: 1;
  background-color: #eff2f2;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const Inner = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 30px;
  background-color: ${({ markersFilterChecked }) =>
    markersFilterChecked ? '#10a49f' : '#27303d'};
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -58%);
`;

const MarkerTitle = styled.div`
  font-family: Jost, sans-serif;
  font-size: 14px;
  font-weight: 300;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  color: #000000;
  padding-left: 42px;
`;

export default {
  FilterWrap,
  FiltersTitle,
  FiltersReset,
  FiltersHeader,
  FiltersCategoriesTitle,
  FilterContainer,
  Contain,
  RingsWrap,
  Outer,
  Middle,
  Inner,
  MarkerTitle
};
