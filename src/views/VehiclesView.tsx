import React from 'react';
import { Route, useHistory, useParams } from 'react-router-dom';

import { apiService } from 'data';
import { Confirm } from 'components';
import { displayError } from 'functions';
import { handleApiResponse } from 'data/api';
import { ICityOption, INotification, ICity } from 'components/types';
import { IVehicle } from 'components/vehicles/types';
import { useActiveCity } from 'hooks';
import { useAppContext } from 'provider';
import DataTable from 'components/vehicles/DataTable';
import Header from 'components/vehicles/Header';
import Loading from 'components/Loading';
import Notification from 'components/Notification';
import Styled from 'components/vehicles/styled';
import VehicleForm from 'components/vehicles/VehicleForm';

const pathname = '/vehicles';

const tableHeading = [
  'ID',
  'Plates',
  'Brand',
  'Model',
  'Vin',
  'Contact Number',
  'Parking Lot',
  'Pairing Status'
];

// You may use '.' annotation to access property data
const tableDataMapping = [
  'id_vehicle',
  'plate_no',
  'brand.name',
  'model.name',
  'vin',
  'contact_phone_number',
  'parking_lot.title',
  'id_device?'
];

const EmptyResults: React.FC = (props) => (
  <Styled.EmptyResults>
    <Styled.EmptyResultsGfx />
    <Styled.EmptyResultsTitle>No vehicle found</Styled.EmptyResultsTitle>
    <Styled.EmptyResultsText>{props.children}</Styled.EmptyResultsText>
  </Styled.EmptyResults>
);

const defaultNotificationProps = {
  title: '',
  type: 'success',
  hasCloseButton: false,
  isVisible: false
};

const VehiclesView: React.FC = () => {
  const [{ cities: cityOptions }]: [{ cities: ICity[] }] = useAppContext();
  const [activeCity, setCity] = useActiveCity(cityOptions) as [
    ICityOption,
    (cityOptions: ICityOption) => void
  ];

  const [vehicles, setVehicles] = React.useState<IVehicle[]>([]);
  const [searchInput, setSearchInput] = React.useState('');
  const [shouldSave, setShouldSave] = React.useState(false);
  const [notification, setNotification] = React.useState<INotification>(
    defaultNotificationProps
  );
  const [isGoingBack, setIsGoingBack] = React.useState(false);
  const [isFormModified, setIsFormModified] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const history = useHistory();
  const { id: vehicleId } = useParams<{ id: string }>();

  const handleSelectItemClick = (item: IVehicle): void => {
    history.push(`${pathname}/${item.id_vehicle}/edit`);
  };

  const handleCreateNew = (): void => {
    history.push(`${pathname}/register`);
  };

  const goBack = (): void => history.push(pathname);

  const handleChangeCity = (selectedCity: ICityOption): void =>
    setCity({ ...activeCity, ...selectedCity });

  const handleSearchInput = (event: React.FormEvent<HTMLInputElement>): void =>
    setSearchInput(event.currentTarget.value);

  const getMatchedVehicles = (): IVehicle[] => {
    if (searchInput) {
      return vehicles.filter((vehicle) =>
        [vehicle.plate_no, vehicle.id_device].some((vehicleProperty) =>
          new RegExp(searchInput).test(vehicleProperty as string)
        )
      );
    }

    return vehicles;
  };

  const handleSubmitSuccess = (registered: boolean): void => {
    const successNotification = {
      type: 'success',
      title: registered
        ? 'New vehicle registered'
        : 'Changes made successfully',
      hasCloseButton: false,
      isVisible: true
    };

    // Go back to list
    goBack();

    // Show notification after a small delay
    setTimeout(() => setNotification(successNotification), 250);

    // Hide notification after a few secs
    setTimeout(
      () => setNotification({ ...successNotification, isVisible: false }),
      3250
    );

    // Reset flag
    setIsFormModified(false);
  };

  const handleSubmitError = (): void => {
    window.setTimeout(
      () =>
        setNotification({
          type: 'failure',
          title: 'Changes were not saved due to an error',
          hasCloseButton: true,
          isVisible: true
        }),
      250
    );
  };

  const handleConfirm = (): void => {
    goBack();
    // Reset
    setIsGoingBack(false);
    setIsFormModified(false);
  };

  const getTitle = (): React.ReactNode => {
    return Number.isNaN(parseInt(vehicleId)) ? (
      'Add Vehicle'
    ) : (
      <>
        Edit Vehicle
        <Styled.Sub data-testid="sub">/ ID {vehicleId}</Styled.Sub>
      </>
    );
  };

  React.useEffect(() => {
    // On the vehicle list view
    if (history.location.pathname === pathname && activeCity?.value)
      (async () => {
        handleApiResponse(
          await apiService.getAllVehicles(activeCity.value),
          (response) => {
            if ('vehicles' in response) {
              setVehicles(response.vehicles);
            }
          },
          (error) => displayError(`${error.name} ${error.message}`, true),
          () => setIsLoading(false)
        );
      })();

    // To hide a possible error message when changing view
    setNotification({ ...notification, isVisible: false });
  }, [history.location.pathname, activeCity]);

  React.useEffect(() => {
    if (!isFormModified && isGoingBack) {
      goBack();
      // Reset
      setIsGoingBack(false);
    }
  }, [isGoingBack]);

  return (
    <Styled.View>
      <Styled.Stage>
        <Route path={`(${pathname})`} exact>
          <Header
            city={activeCity}
            cityOptions={cityOptions}
            searchInput={searchInput}
            onChangeCity={handleChangeCity}
            onSearchInput={handleSearchInput}
            onSearchClear={() => setSearchInput('')}
            onCreateNew={handleCreateNew}
            title="Vehicles"
          />
          {isLoading ? (
            <Loading />
          ) : (
            <DataTable<IVehicle>
              heading={tableHeading}
              items={getMatchedVehicles()}
              mapping={tableDataMapping}
              onRenderEmpty={() => (
                <EmptyResults>
                  {searchInput
                    ? `There is no vehicle matching your search. 
                  Check the plates for any misspelling or search in a different city.`
                    : `It seems that there are no registered vehicles in this city. 
                  Please try another one.`}
                </EmptyResults>
              )}
              onRenderActions={(item) => (
                <Styled.EditItemButton
                  data-testid="edit-item-button"
                  onClick={() => handleSelectItemClick(item)}
                />
              )}
            />
          )}
        </Route>
        <Route path={[`${pathname}/:id/edit`, `${pathname}/register`]} exact>
          <Header
            title={getTitle()}
            submitText={
              Number.isNaN(parseInt(vehicleId)) ? 'Save' : 'Save changes'
            }
            uriBack={pathname}
            onGoingBack={
              Number.isNaN(parseInt(vehicleId))
                ? null
                : () => setIsGoingBack(true)
            }
            onSave={() => setShouldSave(true)}
          />
          <VehicleForm
            id={vehicleId}
            city={activeCity}
            shouldSubmit={shouldSave}
            onAfterSubmit={() => setShouldSave(false)}
            onSubmitSuccess={handleSubmitSuccess}
            onSubmitError={handleSubmitError}
            onChange={() => setIsFormModified(true)}
          />
          <Confirm
            isVisible={isFormModified && isGoingBack}
            onConfirm={handleConfirm}
            onCancel={() => setIsGoingBack(false)}
            title="Leave this page?"
          >
            All changes will be lost. Do you wish to continue?
          </Confirm>
        </Route>
      </Styled.Stage>
      <Notification
        {...notification}
        data-testid="toast-notification"
        onClick={() => setNotification({ ...notification, isVisible: false })}
      />
    </Styled.View>
  );
};

export default VehiclesView;
