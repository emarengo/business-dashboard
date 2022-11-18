/* eslint-disable complexity */
import React from 'react';
import { Route, useHistory, useLocation } from 'react-router-dom';
import mapboxgl from 'mapbox-gl';

import { apiService } from 'data';
import { Confirm } from 'components';
import { displayError } from 'functions';
import {
  DriverAvailability,
  GroupedShifts,
  IShift,
  Languages,
  Shifts,
  ShiftStatus,
  ShiftType
} from 'components/drivers/types';
import { getCapitalCityLatLng } from 'functions/city';
import { handleApiResponse } from 'data/api';
import { IServiceOption } from 'components/types';
import {
  serviceOptmx,
  serviceOptco,
  serviceOptcl,
  driversFilterOpt
} from 'data/config';
import AvailabilityIcon from 'components/drivers/AvailabilityIcon';
import DataTable from 'components/drivers/DataTable';
import env from 'data/environment';
import i18n from 'i18n';
import Notifications from 'components/notifications';
import Performance from 'components/drivers/Performance';
// import PriorityIcon from 'components/drivers/PriorityIcon';
import ShiftAccordion from 'components/drivers/ShiftAccordion';
import ShiftsHeader from 'components/drivers/ShiftsHeader';
import Styled from 'components/drivers/styled';
import token from 'mapbox-access-token';
import ViewHeader from 'components/drivers/ViewHeader';

mapboxgl.accessToken = token;

const baseURI = '/drivers';
const lang = Languages.English;
const envRegion = env.region;

const useShifts = (
  status: ShiftStatus,
  driverId?: string,
  driverName?: string,
  serviceID?: number,
  driverFilterOption?: string
): [Shifts | GroupedShifts, boolean] => {
  const [data, setData] = React.useState<Shifts | GroupedShifts>(null);
  const location = useLocation();
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (!isLoading) setIsLoading(true);
  }, [status]);

  React.useEffect(() => {
    (async () => {
      handleApiResponse(
        await apiService.getShifts(
          status,
          driverId,
          driverName,
          serviceID,
          driverFilterOption
        ),
        (response) => {
          if ('data' in response) setData(response.data);
        },
        (error) => {
          displayError(`${error.name}: ${error.message}`);
        }
      );
    })();
  }, [
    status,
    driverId,
    driverName,
    serviceID,
    driverFilterOption,
    location.pathname
  ]);

  React.useEffect(() => {
    if (data !== null) setIsLoading(false);
  }, [data]);

  return [data, isLoading];
};

const DriversView: React.FC = () => {
  const history = useHistory();
  const [isUnsavedChangesModalVisible, setIsUnsavedChangesModalVisible] =
    React.useState(false);
  const [isCurrentSwitchedOn, setIsCurrentSwitchedOn] = React.useState(true);
  const mapRef: React.RefObject<HTMLDivElement> = React.useRef(null);
  const [searchInput, setSearchInput] = React.useState('');
  const [selectedService, setSelectedService] = React.useState('');
  const [driverFilterOption, setdriverFilterOption] = React.useState('');
  const [shifts, isLoadingShifts] = useShifts(
    isCurrentSwitchedOn ? ShiftStatus.Current : ShiftStatus.Previous,
    Number.isNaN(parseInt(searchInput)) ? undefined : searchInput,
    Number.isNaN(parseInt(searchInput)) ? searchInput : undefined,
    Number.isNaN(parseInt(selectedService))
      ? undefined
      : parseInt(selectedService),
    driverFilterOption
  );

  const [searchValue, setSearchValue] = React.useState('');

  React.useEffect(() => {
    if (mapRef.current)
      // eslint-disable-next-line no-new
      new mapboxgl.Map({
        container: mapRef.current,
        style: 'mapbox://styles/beatadmiin/ckbjdllyd2cks1iqhmrdyk2km',
        center: getCapitalCityLatLng(),
        zoom: 12,
        attributionControl: false
      });
  }, []);

  // Retrieves service options from config
  const getServiceOptions = (): IServiceOption[] => {
    switch (envRegion) {
      case 'mx':
        return serviceOptmx;
      case 'co':
        return serviceOptco;
      case 'cl':
        return serviceOptcl;
      default:
        return serviceOptmx;
    }
  };

  const services = getServiceOptions();

  const PLACheckin = (item: IShift): React.ReactNode => {
    const plaCheckIn = item.driver_shift_checkin?.registration_time;
    const plaPlate = item.driver_shift_checkin?.plates;
    const plaKeyTime = item.driver_shift_checkin?.car_assignment_time;
    const checkInString = `${plaCheckIn} / ${plaPlate} / ${plaKeyTime}`;
    const emptyPlaceholder = '-';

    const PLAInputWrapper = (children: string): React.ReactNode => {
      return (
        <Styled.PLAChekinWrapper>
          {plaCheckIn ? children : emptyPlaceholder}
        </Styled.PLAChekinWrapper>
      );
    };
    return PLAInputWrapper(checkInString);
  };

  const handleRenderCell = (
    item: IShift,
    mappingName: string
  ): React.ReactNode => {
    const latestEvent = item.latest_event;
    const href = `${baseURI}/shift/${item.driver_shift_id}`;

    switch (mappingName) {
      case 'availability':
        if (isCurrentSwitchedOn) {
          if (!latestEvent) {
            return (
              <AvailabilityIcon availability={DriverAvailability.NotLogged} />
            );
          }
          if (latestEvent.label === 'Unavailable') {
            return (
              <AvailabilityIcon availability={DriverAvailability.Unavailable} />
            );
          }
          return (
            <AvailabilityIcon availability={DriverAvailability.Available} />
          );
        }
        return null;
      case 'name':
        return (
          <Styled.EventLink
            href={latestEvent && href}
            isDisabled={!latestEvent}
            onClick={(event) => {
              event.preventDefault();
              if (latestEvent) history.push(href);
            }}
          >
            <Styled.FullName>
              {`${item.driver_first_name} ${item.driver_last_name}`.toLowerCase()}
            </Styled.FullName>
            <Styled.DriverID>{item.driver_id}</Styled.DriverID>
            {!!item.driver_shift_total_unavailable_time &&
              item.driver_shift_total_unavailable_time > 1800 && (
                <Styled.OfflineTooltip>
                  Offline time:{' '}
                  {Math.round(item.driver_shift_total_unavailable_time / 60)}
                  &apos;
                </Styled.OfflineTooltip>
              )}
          </Styled.EventLink>
        );
      case 'buffer':
        if (item.driver_shift_type === ShiftType.Buffered)
          return <Styled.InfoIcon />;
        return null;
      case 'prioritization':
        // if (false) {
        //   return <PriorityIcon />;
        // }
        return null;
      case 'pla_checkin':
        return PLACheckin(item);
      case 'status':
        if (item.driver_shift_type) {
          return `${i18n[lang][item.driver_shift_type]}`;
        }
        return '';
      case 'dl_comments':
      default:
        return null;
    }
  };

  const handleSearchInput = (
    event: React.FormEvent<HTMLInputElement>
  ): void => {
    setSearchValue(event.currentTarget.value);
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    if (event.key === 'Enter') {
      setSearchInput(searchValue);
    }
  };

  const handleChangeService = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setSelectedService(event.target.value);
  };

  const handleChangeDriverOption = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setdriverFilterOption(event.target.value);
  };

  const handleUnsavedChangesModalConfirmation = (): void => {
    setIsUnsavedChangesModalVisible(false);
    console.log('Changes discarded');
  };

  const renderEmptyResults = (): React.ReactNode => (
    <Styled.EmptyResults>
      <Styled.EmptyResultsGfx />
      <Styled.EmptyResultsTitle>
        {`No Driver found in ${isCurrentSwitchedOn ? 'Current' : 'Previous'}
        Shifts`}
      </Styled.EmptyResultsTitle>
      <Styled.EmptyResultsText>
        {`Check your Driver's name or ID for any mispelling, or `}
        <Styled.InternalLink
          onClick={() => setIsCurrentSwitchedOn(!isCurrentSwitchedOn)}
        >
          Search in {isCurrentSwitchedOn ? 'Previous' : 'Current'} Shifts
        </Styled.InternalLink>
      </Styled.EmptyResultsText>
    </Styled.EmptyResults>
  );

  return (
    <Styled.View>
      <Route path={`(${baseURI})?`} exact>
        <Styled.Stage isOpaque>
          <ViewHeader title={i18n[lang].drivers_view_title} />
          <Styled.Switch
            labels={['Current Shifts', 'Last 24h Shifts']}
            value={isCurrentSwitchedOn ? 0 : 1}
            onClick={() => setIsCurrentSwitchedOn(!isCurrentSwitchedOn)}
          >
            <Styled.SwitchSlider />
          </Styled.Switch>
          <Styled.MainDataContainer>
            <Styled.ShiftsContainer>
              <ShiftsHeader
                currentShifts={isCurrentSwitchedOn}
                driversFilter={driversFilterOpt}
                searchInput={searchValue}
                services={services}
                onChangeDriverFilterOption={handleChangeDriverOption}
                onChangeService={handleChangeService}
                onHandleKeyDown={handleKeyDown}
                onSearchInput={handleSearchInput}
              />
              <Styled.ShiftsInnerContainer>
                {isCurrentSwitchedOn && isLoadingShifts && (
                  <Styled.DataTableNotice outsideTable>
                    Loading shifts &hellip;
                  </Styled.DataTableNotice>
                )}
                {isCurrentSwitchedOn &&
                  !isLoadingShifts &&
                  !shifts?.length &&
                  renderEmptyResults()}
                {isCurrentSwitchedOn &&
                  !isLoadingShifts &&
                  !!shifts?.length &&
                  'shift_start' in shifts[0] &&
                  (shifts as GroupedShifts)?.map((groupedShift) => (
                    <ShiftAccordion
                      key={`shift-accordion-${groupedShift.shift_start}-${groupedShift.shift_end}`}
                      shiftTitle={i18n[lang].shift}
                      shiftStartTime={groupedShift.shift_start}
                      shiftEndTime={groupedShift.shift_end}
                    >
                      <DataTable<IShift>
                        isLoading={isLoadingShifts}
                        items={groupedShift.shifts}
                        currentShifts={isCurrentSwitchedOn}
                        onRenderCell={(item, prop) =>
                          handleRenderCell(item as IShift, prop)
                        }
                        onRenderEmpty={renderEmptyResults}
                      />
                    </ShiftAccordion>
                  ))}
                {!isCurrentSwitchedOn && (
                  <DataTable<IShift>
                    isLoading={isLoadingShifts}
                    items={shifts as Shifts}
                    currentShifts={isCurrentSwitchedOn}
                    onRenderCell={(item, prop) =>
                      handleRenderCell(item as IShift, prop)
                    }
                    onRenderEmpty={renderEmptyResults}
                  />
                )}
              </Styled.ShiftsInnerContainer>
            </Styled.ShiftsContainer>
            <Styled.SidePanelContainer>
              <Styled.SidePanelInnerContainer style={{ display: 'none' }}>
                Checkin
              </Styled.SidePanelInnerContainer>
            </Styled.SidePanelContainer>
          </Styled.MainDataContainer>
        </Styled.Stage>
        <Confirm
          isVisible={isUnsavedChangesModalVisible}
          onCancel={() => setIsUnsavedChangesModalVisible(false)}
          onConfirm={handleUnsavedChangesModalConfirmation}
          title={i18n[lang].discard_changes_title}
        >
          {i18n[lang].discard_changes_message}
        </Confirm>
      </Route>
      <Route path={`${baseURI}/shift/:id`} exact>
        <Styled.Stage>
          <Styled.Map ref={mapRef} />
          <Performance uriBack={baseURI} isCurrent={isCurrentSwitchedOn} />
        </Styled.Stage>
      </Route>
      <Notifications uri={baseURI} />
    </Styled.View>
  );
};

export default DriversView;
