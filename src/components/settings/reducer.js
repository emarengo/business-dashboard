import Actions from './actions';
import OfflineReason from './OfflineReason';

export default function(state, action) {
  switch (action.type) {
    case Actions.SELECT_CITY:
      const city = {};

      if (action.payload && action.payload.defaultCity) {
        city.defaultCity = action.payload.defaultCity;
      }

      if (action.payload && action.payload.cityId) {
        city.cityId = action.payload.cityId;
      }

      return { ...state, ...city };

    case Actions.TOGGLE_DRIVER_PERFORMANCE:
      return {
        ...state,
        isDriverPerformanceServiceEnabled: !state.isDriverPerformanceServiceEnabled
      };

    case Actions.TOGGLE_ALERTING:
      return { ...state, isAlertingEnabled: !state.isAlertingEnabled };

    case Actions.TOGGLE_GO_OFFLINE_REASONS:
      return {
        ...state,
        isGoOfflineReasonsEnabled: !state.isGoOfflineReasonsEnabled
      };

    case Actions.UPDATE_CITY_SETTINGS:
      const settings = {};

      if ('isAlertingEnabled' in action.payload) {
        settings.isAlertingEnabled = !!action.payload.isAlertingEnabled;
      }

      if ('isGoOfflineReasonsEnabled' in action.payload) {
        settings.isGoOfflineReasonsEnabled = !!action.payload
          .isGoOfflineReasonsEnabled;
      }

      if ('isDriverPerformanceServiceEnabled' in action.payload) {
        settings.isDriverPerformanceServiceEnabled = !!action.payload
          .isDriverPerformanceServiceEnabled;
      }

      if ('countryId' in action.payload) {
        settings.countryId = action.payload.countryId;
      }

      return { ...state, ...settings };

    case Actions.ADD_GO_OFFLINE_REASON:
      return {
        ...state,
        reasons: [...state.reasons, new OfflineReason(state.reasons.length)]
      };

    case Actions.TOGGLE_GO_OFFLINE_REASON_VISIBILITY:
      // Find edited reason
      const reason = state.reasons[action.payload.index];
      reason.index = action.payload.index;
      const prop = action.payload.field;
      return {
        ...setOfflineReasonProperty(state, reason, prop, !reason[prop]),
        // [SPEC] Add 'ignore' flag to errors when the reason is not active
        errors: {
          ...state.errors,
          reasons: {
            ...state.errors.reasons,
            [reason._id]: {
              ...state.errors.reasons[reason._id],
              _ignore: !!reason[prop]
            }
          }
        }
      };

    case Actions.TOGGLE_CONFIRMATION_DIALOG:
      return {
        ...state,
        isConfirmationDialogVisible: !state.isConfirmationDialogVisible,
        section: (action.payload && action.payload.section) || state.section
      };

    case Actions.HANDLE_ALERTING_INPUT:
      return {
        ...state,
        isAlertingSaveButtonVisible:
          state[action.payload.field] !== action.payload.value,
        alerting: {
          ...state.alerting,
          [action.payload.field]: action.payload.value
        }
      };

    case Actions.HANDLE_GO_OFFLINE_REASON_INPUT:
      // Find edited reason
      const edited = state.reasons[action.payload['index']];
      edited.index = action.payload['index'];
      return {
        ...setOfflineReasonProperty(
          state,
          edited,
          action.payload['name'],
          action.payload['value']
        ),
        ...setOfflineReasonErrors(
          state,
          edited,
          action.payload['name'],
          action.payload['error']
        )
      };

    case Actions.TOGGLE_SAVE_BUTTON:
      return {
        ...state,
        isSaveButtonVisible: !state.isSaveButtonVisible
      };

    case Actions.UPDATE_GO_OFFLINE_REASON_ORDER:
      const reasons = [...state.reasons];
      const targetIndex = action.payload.targetIndex;
      const sourceIndex = action.payload.sourceIndex;
      const rr = reasons
        .reduce((accumulator, currentReason, currentIndex) => {
          if (currentIndex === targetIndex) {
            return [
              ...accumulator,
              targetIndex < sourceIndex
                ? state.reasons[sourceIndex]
                : currentReason,
              targetIndex < sourceIndex
                ? currentReason
                : state.reasons[sourceIndex]
            ];
          } else if (currentIndex === sourceIndex) {
            return [...accumulator];
          } else {
            return [...accumulator, currentReason];
          }
        }, [])
        // Need to update 'index' values
        .map((r, index) => {
          r.update('index', index);
          return r;
        });

      return { ...state, reasons: rr, isOfflineReasonsSaveButtonVisible: true };

    case Actions.UPDATE_GO_OFFLINE_REASONS:
      return {
        ...state,
        reasons: action.payload.reasons
      };

    default:
      return state;
  }
}

function setOfflineReasonProperty(state, reason, prop, value) {
  // Create a clone of edited reason
  const clone = new OfflineReason(reason.index).clone(reason);
  // Fresh copy of 'reasons'
  const reasons = [...state.reasons];
  // Figure out if value has changed
  const isSaveButtonVisible = reasons[reason.index][prop] !== value;
  // Update prop with typed value
  clone.update(prop, value);
  // Replace obsolete reason with the updated clone
  reasons[reason.index] = clone;
  return {
    ...state,
    reasons,
    isOfflineReasonsSaveButtonVisible: isSaveButtonVisible
  };
}

function setOfflineReasonErrors(state, reason, inputName, errorMessage) {
  const ERROR_FIELD_REQUIRED = 'This field is required';
  const reasonError = {
    icon: !reason['icon'] ? ERROR_FIELD_REQUIRED : null,
    name: !reason['name'] ? ERROR_FIELD_REQUIRED : null,
    name_en: !reason['name_en'] ? ERROR_FIELD_REQUIRED : null,
    description: !reason['description'] ? ERROR_FIELD_REQUIRED : null,
    description_en: !reason['description_en'] ? ERROR_FIELD_REQUIRED : null,
    code: !reason['code'] ? ERROR_FIELD_REQUIRED : null,
    ...state.errors.reasons[reason._id]
  };

  reasonError[inputName] = errorMessage || null;

  return {
    errors: {
      ...state.errors,
      reasons: {
        ...state.errors.reasons,
        [reason._id]: Object.entries(reasonError).some(
          ([prop, value]) => prop !== '_ignore' && value !== null
        )
          ? reasonError
          : null
      }
    }
  };
}
