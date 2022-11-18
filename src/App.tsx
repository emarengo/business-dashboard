import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ThemeProvider } from '@emotion/react';
import { Fonts, Colors, Icons } from '@thebeatapp/beat-ui';
import {
  StateProvider,
  initialState,
  mainReducer,
  useAppContext
} from './provider';

import Styled from './components/styled';
import { SideNav } from './components';
import {
  DriversView,
  VersionHistoryView,
  GeofencedAreaView,
  SettingsView,
  ShiftsView,
  VehiclesView
} from './views';
import { useCityOptions } from './hooks';
import { displayError, getActiveCity } from './functions';
import { apiService } from './data';
import { handleApiResponse } from './data/api';
import { Settings } from './components/settings/types';

const theme = {
  colors: Colors,
  fonts: Fonts,
  icons: Icons
};

const App: React.FC = () => {
  useCityOptions();
  const [settings, setSettings] = React.useState<Settings>();
  const [{ cities: cityOptions }] = useAppContext();
  const city = getActiveCity(cityOptions);

  const handleSettingsChange = (settingsState: Settings) =>
    setSettings(settingsState);

  React.useEffect(() => {
    (async () => {
      if (city)
        handleApiResponse(
          await apiService.getDriverPerformanceServiceStatus(city.value),
          (response) => {
            if ('data' in response) {
              setSettings({
                isDriverPerformanceServiceEnabled: response.data.enabled
              });
            }
          },
          (error) => {
            displayError(`${error.name}: ${error.message}`);
          }
        );
    })();
  }, [city]);

  return (
    <Styled.Dashboard>
      <Router>
        <SideNav
          {...{
            isDriverPerformanceServiceEnabled: settings
              ? settings.isDriverPerformanceServiceEnabled
              : false,
            home: 'shifts'
          }}
        />
        <Styled.Stage>
          <Switch>
            <Route path="/" component={ShiftsView} exact />
            <Route path="/drivers" component={DriversView} />
            <Route
              path={['/vehicles', '/vehicles/register', '/vehicles/:id/edit']}
              component={VehiclesView}
              exact
            />
            <Route
              path="/geofence/:city?"
              component={GeofencedAreaView}
              exact
            />
            <Route path="/history/:city" component={VersionHistoryView} exact />
            <Route path="/shifts" component={ShiftsView} exact />
            <Route path="/settings" exact>
              <SettingsView
                settings={settings}
                onChange={handleSettingsChange}
              />
            </Route>
          </Switch>
        </Styled.Stage>
      </Router>
    </Styled.Dashboard>
  );
};

export default (): React.ReactElement => (
  <ThemeProvider theme={theme}>
    <StateProvider reducer={mainReducer} initialState={initialState}>
      <App />
    </StateProvider>
  </ThemeProvider>
);
