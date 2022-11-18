import { cleanup } from '../../../renderWithProviders';
import { getDayOfWeek, monthGenerator, weekGenerator } from '../utils';

describe('Utilities testing', () => {
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  afterEach(cleanup);

  it('getDayOfWeek: should render the right day string based on a certain date format(DD.MM.YYYY)', () => {
    // Starting from 20.1.2013 to 26.1.2013 (Sunday to next Saturday)
    for (let i = 0; i <= days.length - 1; i++) {
      expect(getDayOfWeek(`2${i}.1.2013`)).toBe(days[i]);
    }
  });

  it('weekGenerator: should render the last 8 days dates. (starting from 0)', () => {
    // TO BE FIXED:  The extra date added(8) is ingored in the view, but it is needed for looping purposes.
    const lastWeekDays = weekGenerator(7);
    expect(lastWeekDays.length).toBe(8);
  });

  it('monthGenerator: should render 5 weeks', () => {
    const SUBNODE_WEEKS = 5;
    const lastMonthDates = monthGenerator(4);
    expect(lastMonthDates.length).toBe(SUBNODE_WEEKS);

    lastMonthDates.forEach((i, idx) => {
      if (idx === 3) {
        // Week 4 should render 8 dates instead of 7.
        expect(i.subNodes.length).toBe(8);
      } else {
        expect(i.subNodes.length).toBe(7);
      }
    });
  });

  it("monthGenerator: Week 5 should have week's 4 last date as first", () => {
    const lastMonthDates = monthGenerator(4);
    const fourthWeekLastDate = lastMonthDates[3].subNodes[7];
    const lastWeekFirstDate = lastMonthDates[4].subNodes[0];
    expect(lastWeekFirstDate).toBe(fourthWeekLastDate);
  });
});
