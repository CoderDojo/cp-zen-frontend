module.exports = {
  'parent1@example.com': {
    dob: '1976-05-22T00:00:00.000Z',
    children: ['child2'],
  },
  'parent2@example.com': {
    dob: '1969-11-26T00:00:00.000Z',
  },
  'mentor1@example.com': {
    dob: '1969-11-26T00:00:00.000Z',
    firstName: 'mentor',
    lastName: 'one',
  },
  'champion1@example.com': {
    dob: '1969-11-26T00:00:00.000Z',
  },
  'child1o13@example.com':{
    dob: new Date((new Date().getFullYear() - 15).toString()),
    firstName: 'child',
    lastName: '1o13',
  },
  'admin@coderdojo.org': {
    dob: '1996-11-22T00:00:00.000Z',
  },
};
