import React from 'react';
import { cleanup, render } from '../../renderWithProviders';
import SideNav from '../SideNav';

describe('SideNav component', () => {
  let renderResult;

  beforeEach(() => {
    renderResult = render(<SideNav />);
  });

  afterEach(cleanup);

  it('should match snapshot', () => {
    expect(renderResult).toMatchSnapshot();
  });
});
