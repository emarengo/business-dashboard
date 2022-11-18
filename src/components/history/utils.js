const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
// Get day of the week
export const getDayOfWeek = date => {
  const fullDate = date.split('.');
  const currDate = new Date(`${fullDate[2]}, ${fullDate[1]}, ${fullDate[0]}`);
  return days[currDate.getDay()];
};

// Get date format like: FRI 8.10
export const formatDM = date => {
  const fullDate = date.split('.');
  const currentDay = new Date(`${fullDate[2]}, ${fullDate[1]}, ${fullDate[0]}`);
  return `${days[currentDay.getDay()]} ${fullDate[0]}.${fullDate[1]}`;
};

// Get the last day of month
export const getLastDayOfMonth = date =>
  new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

// Timestamp Conversion Utility
export const convertTimestamp = timestamp => new Date(timestamp * 1000);

// Transform history versions payload
export const transformHistoryPayload = data => {
  return data.reduce((acc, item) => {
    const day = convertTimestamp(item.CreatedAt).getDate();
    const month = convertTimestamp(item.CreatedAt).getMonth() + 1;
    const year = convertTimestamp(item.CreatedAt).getFullYear();
    const hours = convertTimestamp(item.CreatedAt).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    const version = [
      {
        active: item.Active,
        id: item.ID,
        hour: hours,
        date: `${day}.${month}`,
        fullDate: `${day}.${month}.${year}`
      }
    ];
    const exists = Object.keys(acc).includes(day.toString());
    acc[day] = {
      date: `${day}.${month}.${year}`,
      versions: exists ? [...acc[day].versions, ...version] : version
    };
    return acc;
  }, {});
};

export const getNodeData = (data, dateParam) => {
  if (data) {
    const results = Object.values(data).find(({ date }) => date === dateParam);

    if (results) {
      results.versions.sort((a, b) => (a.hour < b.hour ? -1 : 1));
    }
    return results;
  }
};

// MIGHT BE IMPROVED IN THE NEAR FUTURE
export const weekGenerator = daysNum => {
  const currentDate = new Date();
  const weekArray = [];
  const NEXT_DAY = 1;

  currentDate.setDate(currentDate.getDate() - 6);
  for (let i = 0; i <= daysNum; i++) {
    weekArray.push(
      `${currentDate.getDate()}.${currentDate.getMonth() +
        1}.${currentDate.getFullYear()}`
    );
    currentDate.setDate(currentDate.getDate() + NEXT_DAY);
  }
  return weekArray;
};

// MIGHT BE IMPROVED IN THE NEAR FUTURE
export const monthGenerator = weeksNum => {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - 28);
  const weekArray = [];

  // Build the last 4 weeks of the month. (included one extra week for the current node)
  for (let i = 0; i <= weeksNum; i++) {
    const lastDayOfMonth = getLastDayOfMonth(currentDate);
    const subNodes = [];
    const NEXT_WEEK_NUMBER_OF_DAYS = i === 3 ? 7 : 6;

    for (
      let currentDay = currentDate.getDate();
      currentDay <= currentDate.getDate() + NEXT_WEEK_NUMBER_OF_DAYS;
      currentDay++
    ) {
      const hasPassedMonth =
        currentDay !== lastDayOfMonth && currentDay >= lastDayOfMonth;

      const day = hasPassedMonth
        ? `${currentDay.toString().split('')[1] - 1}`
        : currentDay;

      const month = hasPassedMonth
        ? currentDate.getMonth() + 2
        : currentDate.getMonth() + 1;

      const dateNode = `${day}.${month}.${currentDate.getFullYear()}`;
      subNodes.push(dateNode);
    }
    weekArray.push({ subNodes });

    currentDate.setDate(currentDate.getDate() + 7);
  }
  return weekArray;
};
