const driverStatistics = {
  driver_id: 12345,
  driver_url: 'http://57u5.hq.sandbox.taxibeat.com/driver/edit/12345',
  driver_first_name: 'Darth',
  driver_last_name: 'Vader',
  avatar_link:
    'https://pbs.twimg.com/profile_images/3103894633/e0d179fc5739a20308331b432e4f3a51_400x400.jpeg',
  driver_shift_start: '0001-01-01T00:00:00Z',
  driver_shift_end: '0001-01-01T00:00:00Z',
  vehicle_plates: 'XYZ-1234',
  overall_rating: 0,
  statistics: {
    cancellation_rate: {
      threshold: 5,
      value: 0.54543534543
    },
    time_offline: {
      value: 5,
      threshold: 60
    },
    shift_completion: 0.11462844942269075,
    rating: {
      threshold: 5,
      value: 4.5,
      votes: 2
    }
  }
};

export default driverStatistics;
