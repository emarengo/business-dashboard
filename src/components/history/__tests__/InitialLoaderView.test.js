import React from 'react';
import { cleanup, render } from '../../../renderWithProviders';
import InitialLoaderView from '../InitialLoaderView';

describe('Initial Loader View', () => {
  let renderResult;
  let node;
  const text = 'Please Wait...';

  beforeEach(() => {
    renderResult = render(<InitialLoaderView text={text} />);
    node = renderResult.getByTestId('LoaderText');
  });

  afterEach(cleanup);

  it('should display the text prop', () => {
    expect(node).toHaveTextContent(text);
  });

  it('should match snapshot', () => {
    expect(node).toMatchSnapshot();
  });
});
