import React from 'react';
import { cleanup, render } from '../../../renderWithProviders';
import NoVersionsView from '../NoVersionsView';

describe('No Versions Screen', () => {
  let renderResult;
  const titleText = 'No versions found';
  const titleDescription =
    'It seems that this city hasn’t any older versions or geofenced area hasn’t been created yet. Try another city';

  beforeEach(() => {
    renderResult = render(<NoVersionsView />);
  });

  afterEach(cleanup);

  it('should display logo image', () => {
    const logo = renderResult.getByTestId('noVersionsLogo');
    expect(logo).toBeInTheDocument();
  });

  it('should show correct title', () => {
    const title = renderResult.getByTestId('noVersionsTitle');
    expect(title).toHaveTextContent(titleText);
  });

  it('should show correct description', () => {
    const description = renderResult.getByTestId('noVersionsText');
    expect(description).toHaveTextContent(titleDescription);
  });

  it('should match screenshot', () => {
    expect(renderResult).toMatchSnapshot();
  });
});
