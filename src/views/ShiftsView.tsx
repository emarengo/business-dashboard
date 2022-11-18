import React from 'react';

import Loading from '../components/Loading';
import Header from '../components/shifts/Header';
import DailySchedule from '../components/shifts/DailySchedule';
import WeeklySchedule from '../components/shifts/WeeklySchedule';
import Styled from '../components/shifts/styled';
import Notification from '../components/Notification';
import { displayError, getInitDateRange, getInitDate } from '../functions';
import { apiService } from '../data';
import { IDateRange, IShift } from '../components/shifts/types';
import { ICity, ICityOption, INotification } from '../components/types';
import { handleApiResponse } from '../data/api';
import { useActiveCity } from '../hooks';
import { useAppContext } from '../provider';

const defaultNotificationProps: INotification = {
  title: '',
  type: 'success',
  hasCloseButton: false,
  isVisible: false,
  message: ''
};

const ShiftViews: React.FC = () => {
  const [{ cities: cityOptions }]: [{ cities: ICity[] }] = useAppContext();
  const [activeCity, setCity] = useActiveCity(cityOptions) as [
    ICityOption,
    (cityOption: ICityOption) => void
  ];

  const [dateRange, setDateRange] = React.useState<IDateRange>(
    getInitDateRange()
  );
  const [citySchedule, setCitySchedule] = React.useState<IShift[]>([]);
  const [viewMode, setViewMode] = React.useState('week');
  const [isLoading, setIsLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<string[]>([]);
  const [notification, setNotification] = React.useState<INotification>(
    defaultNotificationProps
  );

  const getCitySchedule = async (): Promise<void> => {
    // Show loader
    setIsLoading(true);

    // Fetch schedule from server
    handleApiResponse(
      await apiService.getShiftsByCity(
        activeCity.value,
        dateRange.start,
        dateRange.end
      ),
      (response) => {
        if ('shifts' in response) {
          const schedule = [...response.shifts];

          // Order shifts by driver name
          schedule.sort(({ last_name: nameA }, { last_name: nameB }) =>
            nameA?.trim() > nameB?.trim() ? 1 : -1
          );

          setCitySchedule(schedule);
          setIsLoading(false);
        }
      },
      (error) => displayError(`${error.name} ${error.message}`, true),
      () => setIsLoading(false)
    );
  };

  const handleChangeViewMode = (selectedViewMode: string): void => {
    if (selectedViewMode !== viewMode) {
      setTimeout(() => setIsLoading(true), 0);
    }

    // Heavy. Future experiment: use concurrency? (Suspense & useTransition)
    setTimeout(() => setViewMode(selectedViewMode), 1500);
  };

  const handleChangeCity = (selectedCity: ICityOption): void =>
    setCity({ ...activeCity, ...selectedCity });

  const handleChangeDateRange = (selectedDateRange: IDateRange): void =>
    setDateRange(selectedDateRange);

  const handleCsvFileInput = async (
    csvFileContent: string | ArrayBuffer | null
  ): Promise<void> => {
    // Show loader
    setIsLoading(true);

    // Hide a notification that is already visible
    setNotification({ ...notification, isVisible: false });
    // Upload file to server
    handleApiResponse(
      await apiService.postShifts(activeCity.value, csvFileContent),
      () => {
        setIsLoading(false);
        setNotification({
          type: 'success',
          title: 'Shifts were successfully imported',
          hasCloseButton: true,
          isVisible: true,
          message: ''
        });
        setTimeout(
          () => setNotification({ ...notification, isVisible: false }),
          3000
        );
      },
      (error) => {
        switch (error.statusCode) {
          case 400:
            setErrors(error.getLogMessages());
            break;
          case 500:
            setNotification({
              type: 'failure',
              title: 'Import failed.',
              message: 'The file is invalid. Please review it and try again.',
              isVisible: true,
              hasCloseButton: true
            });
            setTimeout(
              () => setNotification({ ...notification, isVisible: false }),
              3000
            );
            break;
          default:
            displayError(`${error.name} ${error.message}`);
            break;
        }

        setIsLoading(false);
      }
    );
  };

  React.useEffect(() => {
    (async () => {
      if (activeCity.value) getCitySchedule();
    })();
    // eslint-disable-next-line
  }, [activeCity, dateRange, notification]);

  React.useEffect(() => {
    const defaultDateRange: IDateRange = getInitDateRange();

    if (viewMode === 'day') {
      defaultDateRange.start = getInitDate();
      defaultDateRange.end = defaultDateRange.start;
    }

    setDateRange(defaultDateRange);
  }, [viewMode]);

  return (
    <Styled.Shifts hasBackgroundWithGradient={viewMode === 'week'}>
      <Header
        onFileInput={handleCsvFileInput}
        onChangeCity={handleChangeCity}
        onChangeViewMode={handleChangeViewMode}
        onChangeDateRange={handleChangeDateRange}
        city={activeCity}
        cityOptions={cityOptions}
        mode={viewMode}
        errors={errors}
        title="Shifts"
      />
      <Notification
        {...notification}
        onClick={() => setNotification({ ...notification, isVisible: false })}
      >
        {notification.message}
      </Notification>
      <Styled.Pane>
        {isLoading && <Loading />}
        {viewMode === 'week' ? (
          <WeeklySchedule schedule={citySchedule} week={dateRange} />
        ) : (
          <DailySchedule schedule={citySchedule} />
        )}
      </Styled.Pane>
    </Styled.Shifts>
  );
};

export default ShiftViews;
