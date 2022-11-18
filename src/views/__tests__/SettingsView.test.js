import React from 'react';
import {
  screen,
  queryByTestId,
  queryAllByPlaceholderText
} from '@testing-library/dom';
import { render, fireEvent } from '../../renderWithProviders';
import { act } from 'react-dom/test-utils';
import MockOfflineReason from '../../components/settings/OfflineReason';
import { StateProvider, initialState, mainReducer } from '../../provider';
import SettingsView from '../SettingsView';

jest.mock('../../components/settings/init', () => {
  return {
    __esModule: true,
    default: {
      isAlertingEnabled: false,
      isGoOfflineReasonsEnabled: true,
      city: 'Cape Town',
      alerting: {},
      reasons: [
        new MockOfflineReason(),
        new MockOfflineReason(),
        new MockOfflineReason()
      ],
      isConfirmationDialogVisible: false,
      isAlertingSaveButtonVisible: true
    }
  };
});

describe('SettingsView', () => {
  beforeEach(async () => {
    await act(async () => {
      render(
        <StateProvider reducer={mainReducer} initialState={initialState}>
          <SettingsView />
        </StateProvider>
      );
    });
  });

  test('should contain a dropdown to select the city', () => {
    const header = screen.getByTestId('settings-header');
    expect(queryByTestId(header, 'settings-city-select')).not.toBe(null);
  });

  test('should contain the form for alerting', () => {
    const fieldset = screen.getByTestId('alerting');

    // Assert there is a switch set 'off'
    expect(queryByTestId(fieldset, 'switch').dataset.text).toEqual('off');

    // Assert tooltip appears when 'mouseover' on info icon  is triggered
    fireEvent.mouseOver(queryByTestId(fieldset, 'info-icon'));
    const tooltip = screen.getByTestId('alerting-tooltip');
    expect(getComputedStyle(tooltip).opacity).toBe('1');

    [
      // Assert all fields are rendered
      { 'Display alert after:': HTMLInputElement },
      { 'Title on Status screen Alert': HTMLInputElement },
      { 'Title of mobile Notification': HTMLInputElement },
      { 'Description on Status screen Alert': HTMLTextAreaElement },
      { 'Description on mobile Notification': HTMLTextAreaElement }
    ].forEach(i => {
      const [[text, func]] = Object.entries(i);
      expect(screen.getByLabelText(new RegExp(text))).toBeInstanceOf(func);
    });
  });

  test('should contain the reasons for going offline form', () => {
    // Assert there is a switch set 'on'
    const fieldset = screen.getByTestId('go-offline-reasons');
    expect(queryByTestId(fieldset, 'switch').dataset.text).toBe('on');

    const rows = screen.getAllByTestId('grid-draggable-row');

    // Assert number of rendered rows
    expect(rows).toHaveLength(3);

    // Assert content of a single row
    const singleRow = rows.pop();
    expect(queryAllByPlaceholderText(singleRow, 'Type')).toHaveLength(1);
    expect(queryAllByPlaceholderText(singleRow, /Max \d/)).toHaveLength(5);
  });

  test('should add new offline reasons', async () => {
    await act(async () => {
      // Add more rows
      fireEvent.click(screen.getByText(/Add reason/));
      fireEvent.click(screen.getByText(/Add reason/));
    });

    // Assert the updated number of rows
    expect(screen.getAllByTestId('grid-draggable-row')).toHaveLength(5);
  });

  test('should open confirmation dialog on save', () => {
    // Assert that modal is not open
    expect(screen.getByTestId('beat-modal')).not.toHaveClass('is-visible');

    fireEvent.click(screen.getByText('Save changes'));

    // Assert that modal is now open
    expect(screen.getByTestId('beat-modal')).toHaveClass('is-visible');
  });

  test('should be able to make an offline reason invisible', () => {
    const row = screen.getAllByTestId('grid-draggable-row').shift();
    const visibilityButton = queryByTestId(row, 'offline-reason-visibility');
    const fields = queryByTestId(row, 'offline-reason-fields');

    fireEvent.click(visibilityButton);

    // Assert making offline reason to appear as 'invisible'
    expect(getComputedStyle(fields).opacity).toBe('0.3');
  });
});
