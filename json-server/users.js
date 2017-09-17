module.exports = {
  'parent1@example.com': {
    id: 'parent1',
    firstName: 'parent',
    lastName: 'one',
    name: 'parent one',
    email: 'parent1@example.com',
    initUserType: JSON.stringify({name: 'parent-guardian', title: 'Parent/Guardian'}),
    roles: ['basic-user'],
    children: {'child1': {
      id: 'child1',
      userId: 'uchild1',
      firstName: 'child',
      lastName: 'one',
    }}
  },
  'parent2@example.com': {
    id: 'parent2',
    firstName: 'parent',
    lastName: 'two',
    name: 'parent two',
    email: 'parent2@example.com',
    initUserType: JSON.stringify({name: 'parent-guardian', title: 'Parent/Guardian'}),
    roles: ['basic-user'],
  },
  'child1o13@example.com':{
    id: 'child1o13',
    firstName: 'child',
    lastName: '1o13',
    name: 'child 1o13',
    email: 'child1o13@example.com',
    initUserType: JSON.stringify({name: 'attendee-o13', title: 'Youth Over 13'}),
    roles: ['basic-user'],
  },
  'admin@coderdojo.org': {
    id: 'cdfadmin',
    firstName: 'CDF',
    lastName: 'Admin',
    name: 'CDF Admin',
    email: 'admin@coderdojo.org',
    initUserType: JSON.stringify({name: 'parent-guardian', title: 'Parent/Guardian'}),
    roles: ['cdf-admin'],
  },
};
