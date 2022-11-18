import React from 'react';
import { Switch, TextInput, TextArea, withTooltip } from '@thebeatapp/beat-ui';

import Styled from './styled';
import Actions from './actions';

const INPUT_MAX_LENGTH = 35;
const TEXTAREA_MAX_LENGTH = 70;

export default ({ state, dispatch }) => {
  const InfoIcon = withTooltip(Styled.InfoIcon, {
    tip: `No of seconds that the driver will be out 
    of geofenced area before displaying the alert.`,
    testId: 'alerting-tooltip'
  });

  const handleInputChange = field => event => {
    dispatch({
      type: Actions.HANDLE_ALERTING_INPUT,
      payload: {
        value: event.target.value,
        field
      }
    });
  };

  const saveButton = state.isAlertingSaveButtonVisible ? (
    <Styled.Button
      onClick={() =>
        dispatch({
          type: Actions.TOGGLE_CONFIRMATION_DIALOG,
          payload: {
            section: '_ALERTING_FORM_'
          }
        })
      }
    >
      Save changes
    </Styled.Button>
  ) : null;

  return (
    <Styled.Fieldset data-testid="alerting">
      <Styled.Legend>
        <Switch
          isActive={state.isAlertingEnabled}
          onClick={() => dispatch({ type: Actions.TOGGLE_ALERTING })}
          testId="alerting-switch"
        />
        <Styled.Title>Alerting</Styled.Title>
        {saveButton}
      </Styled.Legend>
      <Styled.Description>
        Alerting system for drivers when they are located out of geofenced area.
      </Styled.Description>
      <Styled.Group>
        <Styled.FullSpan>
          <Styled.Field isSmall>
            <Styled.Label htmlFor="display-alert-after-secs">
              Display alert after: <InfoIcon data-testid="info-icon" />
            </Styled.Label>
            <TextInput
              id="display-alert-after-secs"
              placeholder="No of seconds"
              onChange={handleInputChange('display_alert_after_secs')}
              value={state.alerting['display_alert_after_secs']}
            />
          </Styled.Field>
        </Styled.FullSpan>
        <Styled.Field>
          <Styled.Label htmlFor="alerting-title">
            Title on Status screen Alert
          </Styled.Label>
          <TextInput
            id="alerting-title"
            placeholder={`Max ${INPUT_MAX_LENGTH} characters`}
            maxLength={INPUT_MAX_LENGTH}
            onChange={handleInputChange('alert_title')}
            value={state.alerting['alert_title']}
          />
        </Styled.Field>
        <Styled.Field>
          <Styled.Label htmlFor="alerting-notification-title">
            Title of mobile Notification
          </Styled.Label>
          <TextInput
            id="alerting-notification-title"
            placeholder={`Max ${INPUT_MAX_LENGTH} characters`}
            maxLength={INPUT_MAX_LENGTH}
            onChange={handleInputChange('mobile_notification_title')}
            value={state.alerting['mobile_notification_title']}
          />
        </Styled.Field>
        <Styled.Field>
          <Styled.Label htmlFor="alert-description">
            Description on Status screen Alert
          </Styled.Label>
          <TextArea
            id="alert-description"
            placeholder={`Max ${TEXTAREA_MAX_LENGTH} characters`}
            maxLength={TEXTAREA_MAX_LENGTH}
            onChange={handleInputChange('alert_description')}
            value={state.alerting['alert_description']}
          />
        </Styled.Field>
        <Styled.Field>
          <Styled.Label htmlFor="mobile-notification-description">
            Description on mobile Notification
          </Styled.Label>
          <TextArea
            id="mobile-notification-description"
            placeholder={`Max ${TEXTAREA_MAX_LENGTH} characters`}
            maxLength={TEXTAREA_MAX_LENGTH}
            onChange={handleInputChange('mobile_notification_description')}
            value={state.alerting['mobile_notification_description']}
          />
        </Styled.Field>
      </Styled.Group>
    </Styled.Fieldset>
  );
};
