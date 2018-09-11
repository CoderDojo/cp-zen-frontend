module.exports = {
  'parent1@example.com': {
    name: 'parent 1one',
    userId: 'parent1',
    dob: '1976-05-22T00:00:00.000Z',
    children: ['child1', 'child2', 'child3'],
    gender: 'Female',
  },
  'child1@example.com': {
    id: 'pchild1',
    userId: 'child1',
    name: 'child1 one',
    firstName: 'child1',
    lastName: 'one',
    gender: 'Male',
    badges: [{
      name: 'Coolest Projects 2016',
      imageUrl: 'http://badgekit.coderdojo.com:80/images/badge/57',
      dateAccepted: "2018-05-03T15:48:47.453Z",
    }, {
      name: 'CoderDojo Ethos: Implementation and Practice',
      imageUrl: 'http://badgekit.coderdojo.com:80/images/badge/62',
      dateAccepted: "2017-05-03T15:48:47.453Z",
    }, {
      name: 'Mentor Badge',
      imageUrl: 'http://badgekit.coderdojo.com:80/images/badge/50',
      dateAccepted: "2016-05-03T15:48:47.453Z",
    }, {
      name: 'Sample Badge 3',
      imageUrl: 'http://badgekit.coderdojo.com:80/images/badge/3',
      dateAccepted: "2016-05-03T15:48:47.453Z",
    }, {
      name: 'Sample Badge 4',
      imageUrl: 'http://badgekit.coderdojo.com:80/images/badge/4',
      dateAccepted: "2016-05-03T15:48:47.453Z",
    }, {
      name: 'Sample Badge 5',
      imageUrl: 'http://badgekit.coderdojo.com:80/images/badge/5',
      dateAccepted: "2016-05-03T15:48:47.453Z",
    }],
  },
  'child2@example.com': {
    id: 'pchild2',
    userId: 'child2',
    name: 'child2 one',
    firstName: 'child2',
    lastName: 'one',
    gender: 'Undisclosed',
    badges: [{
      name: 'Coolest Projects 2016',
      imageUrl: 'http://badgekit.coderdojo.com:80/images/badge/57',
      dateAccepted: "2018-05-03T15:48:47.453Z",
    }, {
      name: 'CoderDojo Ethos: Implementation and Practice',
      imageUrl: 'http://badgekit.coderdojo.com:80/images/badge/62',
      dateAccepted: "2018-05-03T15:48:47.453Z",
    }, {
      name: 'Mentor Badge',
      imageUrl: 'http://badgekit.coderdojo.com:80/images/badge/50',
      dateAccepted: "2018-05-03T15:48:47.453Z",
    }],
  },
  'parent2@example.com': {
    dob: '1969-11-26T00:00:00.000Z',
    gender: null,
  },
  'parent3@example.com': {
    userId: 'parent3',
    dob: '1976-05-22T00:00:00.000Z',
    children: ['child3'],
    gender: 'Male',
  },
  'mentor1@example.com': {
    userId: 'mentor1',
    dob: '1969-11-26T00:00:00.000Z',
    firstName: 'mentor',
    lastName: 'one',
    gender: 'Male',
  },
  'champion1@example.com': {
    dob: '1969-11-26T00:00:00.000Z',
    gender: 'Female',
  },
  'child1o13@example.com':{
    userId: 'child1o13',
    dob: new Date((new Date().getFullYear() - 15).toString()),
    firstName: 'child',
    lastName: '1o13',
    gender: 'Male',
  },
  'child3@example.com':{
    userId: 'child3',
    dob: new Date((new Date().getFullYear() - 10).toString()),
    name: 'child 3three',
    firstName: 'child',
    lastName: '3three',
    gender: 'Female',
  },
  'admin@coderdojo.org': {
    dob: '1996-11-22T00:00:00.000Z',
    gender: 'Male',
  },
};
