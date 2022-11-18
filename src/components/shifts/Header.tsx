import React from 'react';
import { Option } from '@thebeatapp/beat-ui';

import DateSelector from './DateSelector';
import Styled from './styled';
import { IDateRange } from './types';
import { FileData, IHeader } from '../types';

const Header: React.FC<IHeader> = ({
  errors,
  mode,
  city,
  cityOptions,
  title,
  onChangeCity,
  onChangeViewMode,
  onChangeDateRange,
  onFileInput
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isErrorPaneVisible, setIsErrorPaneVisible] = React.useState(false);

  React.useEffect(() => {
    if (errors) {
      setIsErrorPaneVisible(errors.length > 0);
    }
  }, [errors]);

  const handleFileInput = (
    event: React.FormEvent<HTMLInputElement>,
    onReadFile?: (fileData: FileData) => Promise<void>
  ): void => {
    const { files } = event.currentTarget;
    const file = files && files.item(0);
    const maxMb = 2;

    if (file && file.size > maxMb * 10 ** 6) {
      const warning = `File should have a size up to ${maxMb}MB`;
      // eslint-disable-next-line no-alert
      alert(warning);
      // eslint-disable-next-line
      console.warn(warning);
      return;
    }

    if (file) {
      const fileReader = new FileReader();
      fileReader.readAsText(file);
      if (onReadFile) {
        fileReader.addEventListener('load', () => {
          onReadFile(fileReader.result);
        });
      }
    }

    // Reset so that the same file can be selected again
    // eslint-disable-next-line no-param-reassign
    event.currentTarget.value = '';

    // Hide errors in case they are visible
    setIsErrorPaneVisible(false);
  };

  const handleChangeViewMode = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    if (onChangeViewMode) onChangeViewMode(event.target.value);
  };

  const handleDateRangeChange = (dateRange: IDateRange): void => {
    if (onChangeDateRange) onChangeDateRange(dateRange);
  };

  return (
    <Styled.Header data-testid="shifts-header">
      <Styled.HeaderBlock align="left">
        <Styled.HeaderTitle>{title}</Styled.HeaderTitle>
        <Styled.FileInputButton
          data-testid="button-schedule-import"
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
        />
        <Styled.FileInput
          ref={fileInputRef}
          type="file"
          accept="text/csv"
          onInput={(event: React.FormEvent<HTMLInputElement>) =>
            handleFileInput(event, onFileInput)
          }
          data-testid="file-input"
        />
      </Styled.HeaderBlock>
      <Styled.HeaderBlock align="right">
        {onChangeCity && (
          <Styled.CityDropdown
            id="schedule-city"
            testId="dropdown-schedule-city"
            options={cityOptions}
            defaultSelected={city ? city.label : ''}
            size="small"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              onChangeCity({ value: event.target.value })
            }
          />
        )}
        {onChangeViewMode && (
          <Styled.ViewModeDropdown
            id="schedule-view-mode"
            testId="dropdown-schedule-view-mode"
            defaultSelected="Week"
            size="small"
            onChange={handleChangeViewMode}
          >
            <Option key="week" value="week">
              Week
            </Option>
            <Option key="day" value="day">
              Day
            </Option>
          </Styled.ViewModeDropdown>
        )}
      </Styled.HeaderBlock>
      {onChangeDateRange && (
        <Styled.HeaderBlockBottom>
          {mode === 'week' ? (
            <DateSelector mode="week" onChange={handleDateRangeChange} />
          ) : (
            <DateSelector mode="day" onChange={handleDateRangeChange} />
          )}
        </Styled.HeaderBlockBottom>
      )}
      <Styled.ErrorPane
        data-testid="schedule-errors-pane"
        isVisible={isErrorPaneVisible}
      >
        <Styled.ErrorHeader>
          <Styled.ErrorTitle>Cannot import shifts.</Styled.ErrorTitle>
          <Styled.ErrorMessage>
            Please review the following errors and try again.
          </Styled.ErrorMessage>
          <Styled.ErrorClose
            onClick={() => setIsErrorPaneVisible(false)}
            data-testid="schedule-errors-close"
          />
        </Styled.ErrorHeader>
        {errors && (
          <Styled.ErrorList>
            {errors.map((validationError, index) => (
              <Styled.ErrorListItem key={`v_err_${index + 1}`}>
                {validationError}
              </Styled.ErrorListItem>
            ))}
          </Styled.ErrorList>
        )}
      </Styled.ErrorPane>
    </Styled.Header>
  );
};

export default Header;
