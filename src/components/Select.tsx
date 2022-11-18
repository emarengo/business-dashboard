import React from 'react';

import Styled from './styled';
import { IOption, ISelect } from './types';

const Select: React.FC<ISelect> = ({
  options = [],
  defaultValue,
  dependsOn,
  name,
  value = null,
  onChange
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleClick = () => {
    if (dependsOn === undefined || dependsOn) {
      if (options.length > 0) {
        setIsOpen(!isOpen);
      }
    }
  };

  const handleOptionClick = (option: IOption) => {
    // Non passive event
    onChange(option, false);
    setIsOpen(false);
  };

  React.useEffect(() => {
    const optionName = value;
    const optionValue = options.find((o) => o.name === optionName)?.value;
    onChange({ name: optionName, value: optionValue }, true);
    // eslint-disable-next-line
  }, [value]);

  return (
    <Styled.Select
      data-testid="select"
      tabIndex={-1}
      onBlur={() => setIsOpen(false)}
    >
      <Styled.SelectCurrent
        onClick={handleClick}
        isValueSet={!!value}
        isOpen={isOpen}
      >
        {value || defaultValue}
      </Styled.SelectCurrent>
      <Styled.SelectOptionList isOpen={isOpen}>
        {options?.map((option: IOption, index: number) => (
          <Styled.SelectOptionItem
            key={`${name}_opt_${index}`}
            isCurrent={option.name === value}
            onClick={() => handleOptionClick(option)}
          >
            {option.name}
          </Styled.SelectOptionItem>
        ))}
      </Styled.SelectOptionList>
    </Styled.Select>
  );
};

export default Select;
