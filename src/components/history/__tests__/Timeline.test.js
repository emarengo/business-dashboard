import React from 'react';
import { cleanup, render } from '../../../renderWithProviders';
import { historyVersions } from '../../../data/__mocks__/versions';
import { transformHistoryPayload, getDayOfWeek, weekGenerator } from '../utils';

import Timeline from '../Timeline';
// ALL TESTS ARE EVALUATED BASED ON ATTRIBUTE VALUES BECAUSE ALL DATES ARE USED AS PSEUDO ELEMENTS. NOT ACTUAL TEXT CONTENT
describe('Renders Timeline Weekly & Monthly Nodes', () => {
  let renderResult;
  const payload = transformHistoryPayload(historyVersions);
  const onHistoryChange = jest.fn();
  const date = new Date();

  const propsOptions = {
    onHistoryChange: () => onHistoryChange,
    data: payload
  };

  afterEach(cleanup);

  it('Should render weekly nodes correctly based on the current date.', () => {
    renderResult = render(<Timeline showBy={'week'} {...propsOptions} />);
    const weekDays = weekGenerator(6);
    const nodes = renderResult.getByTestId('timeline');
    for (let i = 0; i <= weekDays.length; i++) {
      const day =
        i !== weekDays.length ? getDayOfWeek(weekDays[i]) : 'currentNode';

      expect(
        nodes.getElementsByTagName('LI')[i].getAttribute('data-testid')
      ).toBe(day);
    }
  });

  it('Should render monthly nodes correctly based on the current date.', () => {
    renderResult = render(<Timeline showBy={'month'} {...propsOptions} />);
    const NUMBER_OF_WEEKS = 4;
    const nodes = renderResult.getByTestId('timeline');

    for (let i = 0; i <= NUMBER_OF_WEEKS; i++) {
      const currentDate = `${date.getDate()}.${date.getMonth() +
        1}.${date.getFullYear()}`;
      const day =
        i !== 4 ? `${getDayOfWeek(currentDate)}-${i + 1}` : 'currentNode';

      expect(
        nodes.getElementsByTagName('LI')[i].getAttribute('data-testid')
      ).toBe(day);
    }
  });
});
