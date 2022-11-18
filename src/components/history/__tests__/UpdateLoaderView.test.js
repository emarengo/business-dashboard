import React from 'react';
import { cleanup, render } from '../../../renderWithProviders';
import UpdateLoaderView from '../UpdateLoaderView';

describe('Update Loader View', () => {
  let renderResult;
  let node;

  const title = 'Version still uploading…';

  beforeEach(() => {
    renderResult = render(<UpdateLoaderView />);
  });

  afterEach(cleanup);

  it('should display the logo', () => {
    node = renderResult.getByTestId('UpdateLogo');
    expect(node).toBeInTheDocument();
  });

  it('should display title', () => {
    node = renderResult.getByTestId('UpdateLoaderTitle');
    expect(node).toHaveTextContent(title);
  });

  it('should display description text', () => {
    node = renderResult.getByTestId('UpdateLoaderText');
    expect(node).toBeInTheDocument();
  });

  it('should match snapshot', () => {
    expect(node).toMatchSnapshot();
  });
});
