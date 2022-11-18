/**
 * @return {number} The hours have currently passed since 00:00
 */
import { IDateRange, ITimeRange } from '../components/shifts/types';

export function getPastHours(): number {
  const date: Date = new Date();
  const pastHours: number = date.getHours() + date.getMinutes() / 60;

  return Math.round(pastHours * 100 + Number.EPSILON) / 100;
}

/**
 * @param {object|number} ts Either a timestamp, or an object:
 *                           '{ start: <string | number>, end: <string | number> }',
 * @return {string} A string formatted as 'Monday July 13, 2020'
 */
export function formatDate(ts: ITimeRange | number): string {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  const weekdays = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ];

  if (typeof ts === 'object') {
    // Some basic check
    if (!('start' in ts) || !('end' in ts))
      throw new Error('Misformatted date object.');

    const start = new Date(ts.start);
    const end = new Date(ts.end);
    const startDate = start.getDate();
    const endDate = end.getDate();
    const startMonth = months[start.getMonth()];
    const endMonth = months[end.getMonth()];
    const year = start.getFullYear();

    return `${startMonth} ${startDate} – ${
      startMonth !== endMonth ? `${endMonth} ` : ''
    }${endDate}, ${year}`;
  }

  const _d = new Date(ts);
  const weekday = weekdays[_d.getDay()];
  const month = months[_d.getMonth()];
  const date = _d.getDate();

  return `${weekday} ${month} ${date}, ${_d.getFullYear()}`;
}

export function formatDateAsISOString(date: number | string | Date): string {
  return new Date(date).toISOString().split('T').shift() as string;
}

/**
 * @param {string} dateTime 'YYYY-MM-DDTHH:MM:SSZ'
 * @return {Array} [YYYY-MM-DD, HH:MM]
 */
export function getFormattedDateAndTime(dateTime: string): string[] {
  const [date, time] = dateTime.split('T');

  return [date, time.substring(0, 5)];
}

/**
 * @param {number} timestamp
 * @return {number} The number of days of the month
 *                  based on the given timestamp
 */
function getMonthDays(timestamp: number): number {
  const date = new Date(timestamp);
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

/**
 * @param {string} dateString
 * @param {number} weekDay
 * @return The schedule date as a single number, e.g. 28
 */
export function getWeeklyScheduleDate(
  dateString: string,
  weekDay: number
): number {
  const timestamp = new Date(dateString).getTime();
  const date = new Date(timestamp);
  const seedDay = date.getDay();
  const seedDate = date.getDate();
  const day = seedDate - (seedDay - weekDay - 1);
  const monthDays = getMonthDays(timestamp);

  if (day > monthDays) {
    return day - monthDays;
  }

  return day;
}

export function getDayMsecs(): number {
  return 24 * 60 * 60 * 1000;
}

/**
 * @return An object with 'start' and 'end' timestamps
 */
export function getCurrentWeek(): ITimeRange {
  const currentDate = new Date();
  const weekDay = currentDate.getDay() || 7;
  const timestamp = currentDate.getTime();

  return {
    start: timestamp - (weekDay - 1) * getDayMsecs(),
    end: timestamp + (7 - weekDay) * getDayMsecs()
  };
}

export function getInitDateRange(): IDateRange {
  const currentWeek = getCurrentWeek();
  // Convert timestamps to ISO format (date only)
  return {
    start: formatDateAsISOString(currentWeek.start),
    end: formatDateAsISOString(currentWeek.end)
  };
}

export function getInitDate(): string {
  return formatDateAsISOString(Date.now());
}

/**
 * @param {string} dateTime 'YYYY-MM-DDTHH:MM:SSZ'
 * @return {string} Time in HH:mm format
 */
export function getTimeString(dateTime: string): string {
  const timeMatch = dateTime.match(/[0-9]{2}:[0-9]{2}/);
  const timeString = Array.isArray(timeMatch) && timeMatch.shift();

  return timeString || '';
}

/**
 * @param {string} dateTime 'YYYY-MM-DDTHH:MM:SSZ'
 * @return {string} date in `Weekday Day Month' format
 */
export function getDateString(dateTime: string): string {
  const _d = new Date(dateTime);
  const weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][
    _d.getDay()
  ];
  const day = _d.getDate().toString().padStart(2, '0');
  const month = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ][_d.getMonth()];

  return `${weekday} ${day} ${month}`;
}

/**
 * @param {string} timeString 'HH:MM'
 * @return {number} Total number of minutes
 */
export function getTotalMinutes(timeString: string): number {
  try {
    const [hours, minutes] = timeString.split(':');
    return parseInt(hours) * 60 + parseInt(minutes);
  } catch (error) {
    console.warn(error);
    return NaN;
  }
}

/**
 * @param {string|number} timestamp
 * @return {{ analysis: Record<string, number>, format: () => string }}
 */
export function getPassedTime(timestamp: string | number): {
  analysis: Record<string, number>;
  format: () => string;
} {
  const diffMs = Date.now() - new Date(timestamp).getTime();
  const minMs = 60 * 1000;
  const hourMs = 60 * minMs;
  const dayMs = 24 * hourMs;
  const monthMs = getMonthDays(Date.now()) * dayMs;

  const analysis = {
    m: Math.floor(diffMs / monthMs),
    d: Math.floor((diffMs % monthMs) / dayMs),
    h: Math.floor((diffMs % dayMs) / hourMs),
    min: Math.ceil((diffMs % hourMs) / minMs)
    // sec: Math.floor((diffMs % minMs) / 1000)
  };

  return {
    analysis,
    format: () =>
      Object.entries(analysis)
        .map(([k, v]) => (v > 0 ? `${v}${k}` : null))
        .filter((i) => i)
        .join(' ')
  };
}

/**
 * @param {string} dateTime 'YYYY-MM-DDTHH:MM:SSZ'
 * @return {string} 'past'|'future'
 */
export function getTimePeriod(dateTime: string): 'past' | 'future' {
  return Date.now() > new Date(dateTime).getTime() ? 'past' : 'future';
}
