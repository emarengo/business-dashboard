import React from 'react';
import { Modal } from '@thebeatapp/beat-ui';

import Settings from '../components/settings/styled';
// eslint-disable-next-line import/no-named-default
import { default as defaultSettings } from '../components/settings/init';
import reducer from '../components/settings/reducer';
import Actions from '../components/settings/actions';
import Header from '../components/settings/Header';
import AlertingSection from '../components/settings/AlertingSection';
import DriverPerformanceSection from '../components/settings/DriverPerformanceSection';
import OfflineReasonsSection from '../components/settings/OfflineReasonsSection';
import { displayError, mapOfflineReasons } from '../functions';
import { apiService } from '../data';
import { CitySettings } from '../constants';
import { handleApiResponse } from '../data/api';

const SettingsView = ({ settings, onChange }) => {
  const [state, dispatch] = React.useReducer(reducer, {
    ...defaultSettings,
    ...settings
  });

  const handleSubmit = async () => {
    let result;
    const offlineReasons = state.reasons.map((reason) => {
      const { _id, saved, index, ...model } = reason;

      // Do not include an empty 'id' to request to avoid a 400 error
      if (!model.id) delete model.id;

      return { rank: index, ...model };
    });

    switch (state.section) {
      case '_ALERTING_SWITCH_':
        break;
      case '_ALERTING_FORM_':
        console.log(`Saving 'alerting' settings`);
        break;
      case '_OFFLINE_REASONS_SWITCH_':
        dispatch({ type: Actions.TOGGLE_GO_OFFLINE_REASONS });

        result = await apiService.setSettingsByCityId(state.cityId, {
          [CitySettings.OfflineReasonEnabled]: Number(
            !state.isGoOfflineReasonsEnabled
          ),
          [CitySettings.CountryId]: state.countryId
        });

        handleApiResponse(
          result,
          () => {},
          (error) => {
            // Reset change
            dispatch({ type: Actions.TOGGLE_GO_OFFLINE_REASONS });

            displayError(`${error.name}: ${error.message}`);
          }
        );

        break;
      case '_OFFLINE_REASONS_FORM_':
        // Save offline reasons
        result = await apiService.setOfflineReasons(
          state.cityId,
          offlineReasons
        );

        handleApiResponse(
          result,
          (response) => {
            const { result: bundle } = response;

            dispatch({
              type: Actions.UPDATE_GO_OFFLINE_REASONS,
              payload: {
                reasons: mapOfflineReasons(bundle.offline_reasons)
              }
            });
          },
          (error) => {
            displayError(`${error.name}: ${error.message}`);
          }
        );
        break;
      case '_DRIVER_PERFORMANCE_SWITCH_':
        dispatch({ type: Actions.TOGGLE_DRIVER_PERFORMANCE });

        result = await apiService.setDriverPerformanceServiceStatus(
          state.cityId,
          !state.isDriverPerformanceServiceEnabled
        );

        handleApiResponse(
          result,
          () => {},
          (error) => {
            // Reset change
            dispatch({ type: Actions.TOGGLE_DRIVER_PERFORMANCE });

            displayError(`${error.name}: ${error.message}`);
          }
        );
        break;
      default:
        break;
    }

    // Hide 'Save' button
    dispatch({ type: Actions.TOGGLE_SAVE_BUTTON });

    // Hide 'Save' dialog
    dispatch({ type: Actions.TOGGLE_CONFIRMATION_DIALOG });
  };

  React.useEffect(() => {
    // In case changes affect the rest of the dashboard
    if (onChange) onChange(state);
    // eslint-disable-next-line
  }, [state]);

  return (
    <>
      <Settings.Stage>
        <Header state={state} dispatch={dispatch} updatedAt="" />
        <Settings.Sections>
          {/* Hide 'AlertingSection' temporarily */}
          {false && <AlertingSection state={state} dispatch={dispatch} />}
          <OfflineReasonsSection state={state} dispatch={dispatch} />
          <DriverPerformanceSection state={state} dispatch={dispatch} />
        </Settings.Sections>
      </Settings.Stage>
      <Modal
        title="ARE YOU SURE?"
        isConfirmationDialog
        isVisible={state.isConfirmationDialogVisible}
        cancelButtonLabel="Cancel"
        confirmButtonLabel="Save"
        onClose={() => dispatch({ type: Actions.TOGGLE_CONFIRMATION_DIALOG })}
        onConfirm={handleSubmit}
      >
        <>
          Changes will affect all Loonshot drivers in this city. Are you sure
          you want to proceed?
        </>
      </Modal>
    </>
  );
};

export default SettingsView;
