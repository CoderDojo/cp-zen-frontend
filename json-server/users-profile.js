module.exports = {
  'parent1@example.com': {
    userId: 'parent1',
    dob: '1976-05-22T00:00:00.000Z',
  },
  'parent2@example.com': {
    dob: '1969-11-26T00:00:00.000Z',
  },
  'parent3@example.com': {
    userId: 'parent3',
    dob: '1976-05-22T00:00:00.000Z',
    children: ['child3'],
  },
  'mentor1@example.com': {
    userId: 'mentor1',
    dob: '1969-11-26T00:00:00.000Z',
    firstName: 'mentor',
    lastName: 'one',
  },
  'champion1@example.com': {
    dob: '1969-11-26T00:00:00.000Z',
  },
  'child1o13@example.com':{
    userId: 'child1o13',
    dob: new Date((new Date().getFullYear() - 15).toString()),
    firstName: 'child',
    lastName: '1o13',
  },
  'child3@example.com':{
    userId: 'child3',
    dob: new Date((new Date().getFullYear() - 10).toString()),
    firstName: 'child',
    lastName: '3three',
  },
  'admin@coderdojo.org': {
    dob: '1996-11-22T00:00:00.000Z',
  },
};
