const getAvatar = id =>
  `https://robohash.org/${id}.jpg?bgset=bg1&set=set4&size=68x68`;

const drivers = [
  {
    id: 1001,
    driver_name: 'Eric Stoltz',
    shift: '10:00 - 18:00',
    event: 'Unavailable',
    comment: 'Kicking and screaming',
    plate: 'TAA 5702',
    rate: 4.2,
    hq_link: 'http://www.cupcakeipsum.com/',
    active: true
  },
  {
    id: 11456,
    driver_name: 'Scott Campbell',
    shift: '10:00 - 18:00',
    event: 'Available',
    comment: 'Some comment',
    plate: 'TAA 5703',
    rate: 4.8,
    hq_link: 'http://www.cupcakeipsum.com/',
    active: true
  },
  {
    id: 11789,
    driver_name: 'Jason Patric',
    shift: '10:00 - 18:00',
    event: 'Unavailable',
    comment: 'Some comment',
    plate: 'TAA 5704',
    rate: 4.5,
    hq_link: 'http://www.cupcakeipsum.com/',
    active: true
  },
  {
    id: 101112,
    driver_name: 'Peter Stormare',
    shift: '10:00 - 18:00',
    event: 'Available',
    comment: 'Good riddance!',
    plate: 'TAA 5705',
    rate: 5.0,
    hq_link: 'http://www.cupcakeipsum.com/',
    active: true
  },
  {
    id: 131415,
    driver_name: 'Ron Perlman',
    shift: '10:00 - 18:00',
    event: 'Unavailable',
    comment: 'Some comment',
    plate: 'TAA 5706',
    rate: 4.2,
    hq_link: 'http://www.cupcakeipsum.com/',
    active: false
  },
  {
    id: 161718,
    driver_name: 'John Cusack',
    shift: '10:00 - 18:00',
    event: 'Unavailable',
    comment: 'Say anything',
    plate: 'TAA 5707',
    rate: 4.6,
    hq_link: 'http://www.cupcakeipsum.com/',
    active: true
  },
  {
    id: 161719,
    driver_name: 'Paul Rudd',
    shift: '10:00 - 18:00',
    event: 'Cancellation',
    comment: 'The Shape of Things',
    plate: 'TAA 5707',
    rate: 4.5,
    hq_link: 'http://www.cupcakeipsum.com/',
    active: true
  },
  {
    id: 161720,
    driver_name: 'Paul Giamatti',
    shift: '10:00 - 18:00',
    event: 'Unavailable',
    comment: 'American Splendor',
    plate: 'TAA 5707',
    rate: 4.1,
    hq_link: 'http://www.cupcakeipsum.com/',
    active: false
  },
  {
    id: 161721,
    driver_name: 'Brad Dourif',
    shift: '10:00 - 18:00',
    event: 'Unavailable',
    comment: 'Wise Blood',
    plate: 'TAA 5707',
    rate: 4.4,
    hq_link: 'http://www.cupcakeipsum.com/',
    active: false
  },
  {
    id: 161722,
    driver_name: 'William H. Macy',
    shift: '10:00 - 18:00',
    event: 'Unavailable',
    comment: '',
    plate: 'TAA 5707',
    rate: 3.8,
    hq_link: 'http://www.cupcakeipsum.com/',
    active: false
  },
  {
    id: 161723,
    driver_name: 'Elliot Gould',
    shift: '10:00 - 18:00',
    event: 'Out of Polygon',
    comment: '',
    plate: 'TAA 5707',
    rate: 4.3,
    hq_link: 'http://www.cupcakeipsum.com/',
    active: false
  },
  {
    id: 161724,
    driver_name: 'Oliver Platt',
    shift: '10:00 - 18:00',
    event: 'Unavailable',
    comment: '',
    plate: 'TAA 5707',
    rate: 4.7,
    hq_link: 'http://www.cupcakeipsum.com/',
    active: false
  }
];

drivers.forEach(driver => (driver.avatar = getAvatar(driver.id)));

export default drivers;
