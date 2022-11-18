import OfflineReason from './OfflineReason';

export default {
  alerting: {},
  cityId: '',
  defaultCity: 'Select city',
  isAlertingEnabled: false,
  isAlertingSaveButtonVisible: false,
  isConfirmationDialogVisible: false,
  isDriverPerformanceServiceEnabled: false,
  isGoOfflineReasonsEnabled: false,
  isOfflineReasonsSaveButtonVisible: false,
  reasons: [new OfflineReason()],
  errors: {
    alerting: {},
    reasons: {}
  }
};
