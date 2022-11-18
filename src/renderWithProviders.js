import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from 'emotion-theming';
import { BeatTheme } from '@thebeatapp/beat-ui';

const customRender = (node, ...options) => {
  return render(
    <Router>
      <ThemeProvider theme={BeatTheme}>{node}</ThemeProvider>
    </Router>,
    ...options
  );
};

export * from '@testing-library/react';
export { customRender as render };
export { customRender as rerender };
