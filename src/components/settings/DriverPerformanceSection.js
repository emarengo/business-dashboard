import React from 'react';
import { Switch } from '@thebeatapp/beat-ui';

import Styled from './styled';
import Actions from './actions';

export default ({ state, dispatch }) => {
  const handleSwitchChange = () => {
    dispatch({
      type: Actions.TOGGLE_CONFIRMATION_DIALOG,
      payload: {
        section: '_DRIVER_PERFORMANCE_SWITCH_'
      }
    });
  };

  return (
    <Styled.Fieldset data-testid="driver-performance">
      <Styled.Legend>
        <Switch
          isActive={state.isDriverPerformanceServiceEnabled}
          onClick={handleSwitchChange}
          testId="driver-performance-switch"
        />
        <Styled.Title>Driver Performance</Styled.Title>
      </Styled.Legend>
      <Styled.Description>
        When the switch is turned on an option will appear in side menu giving
        access to details about a driver's performance for each shift.
      </Styled.Description>
    </Styled.Fieldset>
  );
};
