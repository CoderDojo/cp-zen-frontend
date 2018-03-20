const moment = require('moment');
const currentYear = (new Date()).getFullYear();

module.exports = [
  {
    entity$: '-/cd/events',
    id: 'd206004a-b0ce-4267-bf07-133e8113aa1b',
    name: 'My First Amazing Event',
    country: {
      countryName: 'Ireland',
      countryNumber: 372,
      continent: 'EU',
      alpha2: 'IE',
      alpha3: 'IRL'
    },
    city: {
      nameWithHierarchy: 'Dublin'
    },
    address: 'CHQ',
    createdAt: '2017-05-29T13:53:16.502Z',
    createdBy: '7ae18cb2-582d-4bc9-90d1-47defc2a3563',
    type: 'one-off',
    description: '<p>Join us for our second session back in the autumn term!</br> \
      New beginners will be building games and creating projects using Scratch a visual programming language. Returning ninjas will working on more advanced content so come with your thinking hats and be ready to solve some advanced problems!   \
      <b>Note</b>: Doors open at 5:50 pm attendees will not be able to enter Dogpatch Labs before this. </p> </br>\
      <b>All ninjas should:</b> \
      <ul>\
      <li> Book a ticket </li>\
      <li> Bring a laptop (there are limited laptops available). </li>\
      <li> Bring an Android Phone/Tablet (if they have one & are using App Inventor)</li>\
      <li> Be accompanied by a parent/guardian at all times. </li>\
      </ul>\
      Parents are asked to help get their child set up, laptops turned on etc so mentors can focus on mentoring.',
    dojoId: '3ed47c6d-a689-46a0-883b-1f3fd46e9c77',
    eventbriteId: null,
    eventbriteUrl: null,
    position: null,
    public: true,
    status: 'published',
    recurringType: 'weekly',
    dates: [
      {
        startTime: moment.utc([currentYear + 1, 8, 6, 16, 30, 0]).toISOString(),
        endTime: moment.utc([currentYear + 1, 8, 6, 18, 0, 0]).toISOString()
      }
    ],
    ticketApproval: true,
    sessions: [
      {
        entity$: '-/cd/sessions',
        id: '69624aec-e254-4636-b4c6-f623fdb0421b',
        name: 'Scratch',
        description: 'Beginners welcome',
        eventId: 'd206004a-b0ce-4267-bf07-133e8113aa1b',
        status: 'active',
        tickets: [
          {
            entity$: '-/cd/tickets',
            id: 'e9552002-c0fb-4fa6-8a06-639fae9e5f2a',
            sessionId: '69624aec-e254-4636-b4c6-f623fdb0421b',
            name: 'Laptop Required',
            type: 'ninja',
            quantity: 2,
            deleted: 0,
            invites: null,
            totalApplications: 0,
            approvedApplications: 0
          },
          {
            entity$: '-/cd/tickets',
            id: '7c6d2cb7-0344-4cfd-8808-c0cfebbbe5af',
            sessionId: '69624aec-e254-4636-b4c6-f623fdb0421b',
            name: 'Parent',
            type: 'parent-guardian',
            quantity: 4,
            deleted: 0,
            invites: null,
            totalApplications: 0,
            approvedApplications: 0
          },
          {
            entity$: '-/cd/tickets',
            id: '018a57a1-0696-44ad-81b8-0d7b8480e422',
            sessionId: '69624aec-e254-4636-b4c6-f623fdb0421b',
            name: 'Mentor',
            type: 'mentor',
            quantity: 2,
            deleted: 0,
            invites: null,
            totalApplications: 0,
            approvedApplications: 0
          },
          {
            entity$: '-/cd/tickets',
            id: '97399b94-f396-4a63-a44c-ee5cc164fce3',
            sessionId: '69624aec-e254-4636-b4c6-f623fdb0421b',
            name: 'Bringing a laptop',
            type: 'ninja',
            quantity: 2,
            deleted: 0,
            invites: null,
            totalApplications: 0,
            approvedApplications: 0
          }
        ]
      },
      {
        entity$: '-/cd/sessions',
        id: 'c7329612-25d0-4e76-a70e-476af05275ce',
        name: 'Arduino',
        description: 'Intermediate',
        eventId: 'd206004a-b0ce-4267-bf07-133e8113aa1b',
        status: 'active',
        tickets: [
          {
            entity$: '-/cd/tickets',
            id: '82ac3089-54ca-4afc-8439-6acf4358443c',
            sessionId: 'c7329612-25d0-4e76-a70e-476af05275ce',
            name: 'Laptop required',
            type: 'ninja',
            quantity: 2,
            deleted: 0,
            invites: null,
            totalApplications: 0,
            approvedApplications: 0
          },
          {
            entity$: '-/cd/tickets',
            id: '2d3c1305-36d2-4bb3-bf09-35a13dd9e17a',
            sessionId: 'c7329612-25d0-4e76-a70e-476af05275ce',
            name: 'Mentor',
            type: 'mentor',
            quantity: 2,
            deleted: 0,
            invites: null,
            totalApplications: 0,
            approvedApplications: 0
          },
          {
            entity$: '-/cd/tickets',
            id: 'a7e52c55-4b6e-4339-9211-d64cbda30b79',
            sessionId: 'c7329612-25d0-4e76-a70e-476af05275ce',
            name: 'Bringing a laptop',
            type: 'ninja',
            quantity: 2,
            deleted: 0,
            invites: null,
            totalApplications: 0,
            approvedApplications: 0
          },
          {
            entity$: '-/cd/tickets',
            id: 'c3b2d9e8-5d0f-4eaf-9294-0ffa4f458241',
            sessionId: 'c7329612-25d0-4e76-a70e-476af05275ce',
            name: 'Parent',
            type: 'parent-guardian',
            quantity: 4,
            deleted: 0,
            invites: null,
            totalApplications: 0,
            approvedApplications: 0
          }
        ]
      }
    ]
  },
  {
    entity$: '-/cd/events',
    id: '34174952-8ca4-4189-b8cb-d383e3fde992',
    name: 'My Second Amazing Event',
    country: {
      countryName: 'Ireland',
      countryNumber: 372,
      continent: 'EU',
      alpha2: 'IE',
      alpha3: 'IRL'
    },
    city: {
      nameWithHierarchy: 'Dublin'
    },
    address: 'CHQ',
    createdAt: '2017-05-29T13:57:29.351Z',
    createdBy: '7ae18cb2-582d-4bc9-90d1-47defc2a3563',
    type: 'recurring',
    description: '<p>Join us for our second session back in the autumn term!</br> \
      New beginners will be building games and creating projects using Scratch a visual programming language. Returning ninjas will working on more advanced content so come with your thinking hats and be ready to solve some advanced problems!   \
      <b>Note</b>: Doors open at 5:50 pm attendees will not be able to enter Dogpatch Labs before this. </p> </br>\
      <b>All ninjas should:</b> \
      <ul>\
      <li> Book a ticket </li>\
      <li> Bring a laptop (there are limited laptops available). </li>\
      <li> Bring an Android Phone/Tablet (if they have one & are using App Inventor)</li>\
      <li> Be accompanied by a parent/guardian at all times. </li>\
      </ul>\
      Parents are asked to help get their child set up, laptops turned on etc so mentors can focus on mentoring.',
    dojoId: '3ed47c6d-a689-46a0-883b-1f3fd46e9c77',
    eventbriteId: null,
    eventbriteUrl: null,
    position: null,
    public: true,
    status: 'published',
    recurringType: 'biweekly',
    dates: [
      {
        startTime: '2018-06-03T10:00:00.000Z',
        endTime: '2018-06-03T12:00:00.000Z'
      },
      {
        startTime: '2018-06-17T10:00:00.000Z',
        endTime: '2018-06-17T12:00:00.000Z'
      },
      {
        startTime: '2018-07-01T10:00:00.000Z',
        endTime: '2018-07-01T12:00:00.000Z'
      },
      {
        startTime: '2018-07-15T10:00:00.000Z',
        endTime: '2018-07-15T12:00:00.000Z'
      },
      {
        startTime: '2018-07-29T10:00:00.000Z',
        endTime: '2018-07-29T12:00:00.000Z'
      }
    ],
    ticketApproval: false,
    sessions: [
      {
        entity$: '-/cd/sessions',
        id: '97273d08-6b44-4529-8c75-bdaa7a02ba3e',
        name: 'Raspberry Pi',
        description: 'Rockstars',
        eventId: '34174952-8ca4-4189-b8cb-d383e3fde992',
        status: 'active',
        tickets: [
          {
            entity$: '-/cd/tickets',
            id: 'd0c4ed2a-e983-4268-9aa0-fd4c3f48d498',
            sessionId: '97273d08-6b44-4529-8c75-bdaa7a02ba3e',
            name: 'With Pi',
            type: 'ninja',
            quantity: 5,
            deleted: 0,
            invites: null,
            totalApplications: 0,
            approvedApplications: 0
          },
          {
            entity$: '-/cd/tickets',
            id: '0a15797a-913f-441e-8363-8c4af35f5935',
            sessionId: '97273d08-6b44-4529-8c75-bdaa7a02ba3e',
            name: 'Lacking Pi',
            type: 'ninja',
            quantity: 3,
            deleted: 0,
            invites: null,
            totalApplications: 0,
            approvedApplications: 0
          },
          {
            entity$: '-/cd/tickets',
            id: 'cd1cb404-5ff6-4115-bb8a-de1f9fa37efb',
            sessionId: '97273d08-6b44-4529-8c75-bdaa7a02ba3e',
            name: 'Parents',
            type: 'parent-guardian',
            quantity: 8,
            deleted: 0,
            invites: null,
            totalApplications: 0,
            approvedApplications: 0
          },
          {
            entity$: '-/cd/tickets',
            id: '3a409145-ffcb-4340-8dd7-4938c8b9d9ca',
            sessionId: '97273d08-6b44-4529-8c75-bdaa7a02ba3e',
            name: 'Mentors',
            type: 'mentor',
            quantity: 4,
            deleted: 0,
            invites: null,
            totalApplications: 0,
            approvedApplications: 0
          }
        ]
      },
      {
        entity$: '-/cd/sessions',
        id: '4b05849a-7d37-4ef8-a6fd-4c77c8966bde',
        name: 'Unity',
        description: 'Beginners',
        eventId: '34174952-8ca4-4189-b8cb-d383e3fde992',
        status: 'active',
        tickets: [
          {
            entity$: '-/cd/tickets',
            id: 'de317b7f-b743-4a2a-b454-8d009e848a53',
            sessionId: '4b05849a-7d37-4ef8-a6fd-4c77c8966bde',
            name: 'With Laptops',
            type: 'ninja',
            quantity: 4,
            deleted: 0,
            invites: null,
            totalApplications: 0,
            approvedApplications: 0
          },
          {
            entity$: '-/cd/tickets',
            id: '196a8016-fff5-4999-a0f7-3e558590d5d6',
            sessionId: '4b05849a-7d37-4ef8-a6fd-4c77c8966bde',
            name: 'Parents',
            type: 'parent-guardian',
            quantity: 8,
            deleted: 0,
            invites: null,
            totalApplications: 0,
            approvedApplications: 0
          },
          {
            entity$: '-/cd/tickets',
            id: '63cb3158-3a3c-42ef-9bf7-ae9e86f833eb',
            sessionId: '4b05849a-7d37-4ef8-a6fd-4c77c8966bde',
            name: 'Mentors',
            type: 'mentor',
            quantity: 5,
            deleted: 0,
            invites: null,
            totalApplications: 0,
            approvedApplications: 0
          },
          {
            entity$: '-/cd/tickets',
            id: '4b4c567b-81dc-4251-9c6b-1289d512a8bb',
            sessionId: '4b05849a-7d37-4ef8-a6fd-4c77c8966bde',
            name: 'Laptop required',
            type: 'ninja',
            quantity: 4,
            deleted: 0,
            invites: null,
            totalApplications: 0,
            approvedApplications: 0
          }
        ]
      }
    ]
  },
  {
    entity$: '-/cd/events',
    id: 'd206004a-b0ce-4267-bf07-133e8113aa1a',
    name: 'Test event',
    country: {
      countryName: 'Ireland',
      countryNumber: 372,
      continent: 'EU',
      alpha2: 'IE',
      alpha3: 'IRL'
    },
    city: {
      nameWithHierarchy: 'Dublin'
    },
    address: 'CHQ',
    createdAt: '2017-07-06T16:05:16.502Z',
    createdBy: '7ae18cb2-582d-4bc9-90d1-47defc2a3563',
    type: 'one-off',
    description: '<p>LEARN ALL THE THINGS</p>\n',
    dojoId: '4e591bbe-667b-4782-bc9c-180c6d321883',
    eventbriteId: null,
    eventbriteUrl: null,
    position: null,
    public: true,
    status: 'published',
    recurringType: 'weekly',
    dates: [
      {
        startTime: moment.utc({ hour: 19, minute: 0, second: 0 }).add(1, 'd').toISOString(),
        endTime: moment.utc({ hour: 20, minute: 30, second: 0 }).add(1, 'd').toISOString()
      }
    ],
    ticketApproval: true,
    sessions: [
      {
        entity$: '-/cd/sessions',
        id: '69624aec-e254-4636-b4c6-f623fdb0421j',
        name: 'HTML',
        description: 'HTML',
        eventId: 'd206004a-b0ce-4267-bf07-133e8113aa1a',
        status: 'active',
        tickets: [
          {
            entity$: '-/cd/tickets',
            id: 'e9552002-c0fb-4fa6-8a06-639fae9e5f2n',
            sessionId: '69624aec-e254-4636-b4c6-f623fdb0421j',
            name: 'Laptop Required',
            type: 'ninja',
            quantity: 2,
            deleted: 0,
            invites: null,
            totalApplications: 0,
            approvedApplications: 2
          },
          {
            entity$: '-/cd/tickets',
            id: '7c6d2cb7-0344-4cfd-8808-c0cfebbbe5al',
            sessionId: '69624aec-e254-4636-b4c6-f623fdb0421j',
            name: 'Parent',
            type: 'parent-guardian',
            quantity: 4,
            deleted: 0,
            invites: null,
            totalApplications: 0,
            approvedApplications: 4
          },
          {
            entity$: '-/cd/tickets',
            id: '018a57a1-0696-44ad-81b8-0d7b8480e429',
            sessionId: '69624aec-e254-4636-b4c6-f623fdb0421j',
            name: 'Mentor',
            type: 'mentor',
            quantity: 2,
            deleted: 0,
            invites: null,
            totalApplications: 0,
            approvedApplications: 2
          },
          {
            entity$: '-/cd/tickets',
            id: '97399b94-f396-4a63-a44c-ee5cc164fce4',
            sessionId: '69624aec-e254-4636-b4c6-f623fdb0421j',
            name: 'Bringing a laptop',
            type: 'ninja',
            quantity: 2,
            deleted: 0,
            invites: null,
            totalApplications: 0,
            approvedApplications: 2
          }
        ]
      }
    ]
  },
  {
    entity$: '-/cd/events',
    id: 'd206004a-b0ce-ielc-bf07-kfue8113aa1a',
    name: 'Past event',
    country: {
      countryName: 'Ireland',
      countryNumber: 372,
      continent: 'EU',
      'alpha2': 'IE',
      'alpha3': 'IRL'
    },
    city: {
      nameWithHierarchy: 'Dublin'
    },
    address: 'CHQ',
    createdAt: '2017-07-06T16:05:16.502Z',
    createdBy: '7ae18cb2-582d-4bc9-90d1-47defc2a3563',
    type: 'one-off',
    description: '<p>PAST EVENT</p>\n',
    dojoId: '4e591bbe-667b-4782-bc9c-180c6d321883',
    eventbriteId: null,
    eventbriteUrl: null,
    position: null,
    public: true,
    status: 'published',
    recurringType: 'weekly',
    dates: [
      {
        startTime: '2017-06-10T16:30:00.000Z',
        endTime: '2017-06-10T18:00:00.000Z'
      }
    ],
    ticketApproval: true,
    sessions: [
      {
        entity$: '-/cd/sessions',
        id: '69624aec-e254-iwe3-b4c6-f623fdb0421j',
        name: 'HTML',
        description: 'HTML',
        eventId: 'd206004a-b0ce-ielc-bf07-kfue8113aa1a',
        status: 'active',
        tickets: [
          {
            entity$: '-/cd/tickets',
            id: 'e9552002-c0fb-4fa6-8a06-of9fae9e5f2n',
            sessionId: '69624aec-e254-iwe3-b4c6-f623fdb0421j',
            name: 'Laptop Required',
            type: 'ninja',
            quantity: 2,
            deleted: 0,
            invites: null,
            totalApplications: 0,
            approvedApplications: 2
          }
        ]
      }
    ]
  },
  {
    entity$: '-/cd/events',
    id: '63636e6d-da21-407f-9d73-f553ab8a1fb6',
    name: 'My First Amazing Event',
    country: {
      countryName: 'Ireland',
      countryNumber: 372,
      continent: 'EU',
      alpha2: 'IE',
      alpha3: 'IRL'
    },
    city: {
      nameWithHierarchy: 'Dublin'
    },
    address: 'CHQ',
    createdAt: '2017-05-29T13:53:16.502Z',
    createdBy: 'e73a4435-fcd2-4578-b081-bb9ae004f83b',
    type: 'one-off',
    description: '<p>LEARN ALL THE THINGS</p>\n',
    dojoId: '70e868a9-f2b2-4b73-8f83-7e3a79dfa150',
    eventbriteId: null,
    eventbriteUrl: null,
    position: null,
    public: true,
    status: 'published',
    recurringType: 'weekly',
    dates: [
      {
        startTime: moment.utc({ hour: 14, minute: 45, second: 0 }).add(7, 'd').toISOString(),
        endTime: moment.utc({ hour: 16, minute: 15, second: 0 }).add(7, 'd').toISOString()
      }
    ],
    ticketApproval: true,
    sessions: [
      {
        entity$: '-/cd/sessions',
        id: 'dc666f88-b14e-44f5-b76a-08e8e62c0e24',
        name: 'Hardware',
        description: 'Advanced',
        eventId: '63636e6d-da21-407f-9d73-f553ab8a1fb6',
        status: 'active',
        tickets: [
          {
            entity$: '-/cd/tickets',
            id: 'a8b2a03a-c742-4388-b195-469397eb0ed1',
            sessionId: 'dc666f88-b14e-44f5-b76a-08e8e62c0e24',
            name: 'Ninja',
            type: 'ninja',
            quantity: 2,
            deleted: 0,
            invites: null,
            totalApplications: 0,
            approvedApplications: 0
          },
          {
            entity$: '-/cd/tickets',
            id: 'd9c37e5b-4df1-47d4-bd43-226fbc29d997',
            sessionId: 'dc666f88-b14e-44f5-b76a-08e8e62c0e24',
            name: 'Mentor',
            type: 'mentor',
            quantity: 2,
            deleted: 0,
            invites: null,
            totalApplications: 0,
            approvedApplications: 0
          },
          {
            entity$: '-/cd/tickets',
            id: 'e2921b09-54a5-475a-9c51-7a65dd87ed28',
            sessionId: 'dc666f88-b14e-44f5-b76a-08e8e62c0e24',
            name: 'Parent',
            type: 'parent-guardian',
            quantity: 4,
            deleted: 0,
            invites: null,
            totalApplications: 0,
            approvedApplications: 0
          }
        ]
      }
    ]
  },
  {
    entity$: '-/cd/events',
    id: '67636e6d-da21-407f-9d73-f553ab8a1fb6',
    name: 'My First Private Event',
    country: {
      countryName: 'Ireland',
      countryNumber: 372,
      continent: 'EU',
      alpha2: 'IE',
      alpha3: 'IRL'
    },
    city: {
      nameWithHierarchy: 'Dublin'
    },
    address: 'CHQ',
    createdAt: '2017-05-29T13:53:16.502Z',
    createdBy: 'e73a4435-fcd2-4578-b081-bb9ae004f83b',
    type: 'one-off',
    description: '<p>LEARN ALL THE THINGS</p>\n',
    dojoId: '70e868a9-f2b2-4b73-8f83-7e3a79dfa150',
    eventbriteId: null,
    eventbriteUrl: null,
    position: null,
    public: false,
    status: 'published',
    recurringType: 'weekly',
    dates: [
      {
        startTime: moment.utc({ hour: 10, minute: 0, second: 0}).add(14, 'd').toISOString(),
        endTime: moment.utc({ hour: 12, minute: 0, second: 0}).add(14, 'd').toISOString()
      }
    ],
    ticketApproval: true,
    sessions: [
      {
        entity$: '-/cd/sessions',
        id: 'dc777f88-b14e-44f5-b76a-08e8e62c0e24',
        name: 'Hardware',
        description: 'Advanced',
        eventId: '67636e6d-da21-407f-9d73-f553ab8a1fb6',
        status: 'active',
        tickets: [
          {
            entity$: '-/cd/tickets',
            id: 'a8b5a03a-c742-4388-b195-469397eb0ed1',
            sessionId: 'dc777f88-b14e-44f5-b76a-08e8e62c0e24',
            name: 'Ninja',
            type: 'ninja',
            quantity: 2,
            deleted: 0,
            invites: null,
            totalApplications: 0,
            approvedApplications: 0
          },
          {
            entity$: '-/cd/tickets',
            id: 'd9c37e5b-4df1-47d4-bf43-226fbc29d997',
            sessionId: 'dc777f88-b14e-44f5-b76a-08e8e62c0e24',
            name: 'Mentor',
            type: 'mentor',
            quantity: 2,
            deleted: 0,
            invites: null,
            totalApplications: 0,
            approvedApplications: 0
          },
          {
            entity$: '-/cd/tickets',
            id: 'e2921b09-66a5-475a-9c51-7a65dd87ed28',
            sessionId: 'dc777f88-b14e-44f5-b76a-08e8e62c0e24',
            name: 'Parent',
            type: 'parent-guardian',
            quantity: 4,
            deleted: 0,
            invites: null,
            totalApplications: 0,
            approvedApplications: 0
          }
        ]
      }
    ]
  },
  {
    entity$: '-/cd/events',
    id: '63636e6d-da21-407f-9d73-f553ab8a1ab2',
    name: 'Sri Lannnka',
    country: {
      countryName: 'Sri Lanka',
      countryNumber: 92,
      continent: 'ASIA',
      alpha2: 'LK',
      alpha3: 'LK'
    },
    city: {
      nameWithHierarchy: 'Ganewalpola'
    },
    address: 'Ganewalpola',
    createdAt: '2017-05-29T13:53:16.502Z',
    createdBy: 'e73a4435-fcd2-4578-b081-bb9ae004f83b',
    type: 'one-off',
    description: '<p>LEARN ALL THE THINGS</p>\n',
    dojoId: '70ezk4a9-q0pm-4bk2-8f83-200a799y2k50',
    eventbriteId: 'k2ivy3lc-9ebc-p0bn-gcvd-bb9ae0048h33',
    eventbriteUrl: 'www.eventbrite.com',
    position: null,
    public: true,
    status: 'published',
    recurringType: 'weekly',
    dates: [
      {
        startTime: moment.utc({ hour: 16, minute: 30, second: 0}).add(3, 'd').toISOString(),
        endTime: moment.utc({ hour: 17, minute: 30, second: 0}).add(3, 'd').toISOString()
      }
    ],
    ticketApproval: true,
    sessions: [
      {
        entity$: '-/cd/sessions',
        id: 'dc666f88-b14e-44f5-b76a-08e8e62c0e25',
        name: 'Hardware',
        description: 'Advanced',
        eventId: '63636e6d-da21-407f-9d73-f553ab8a1ab2',
        status: 'active',
        tickets: [
          {
            entity$: '-/cd/tickets',
            id: 'a8b2a03a-c742-4388-b195-469397eb0er4',
            sessionId: 'dc666f88-b14e-44f5-b76a-08e8e62c0e25',
            name: 'Ninja',
            type: 'ninja',
            quantity: 2,
            deleted: 0,
            invites: null,
            totalApplications: 0,
            approvedApplications: 0
          },
          {
            entity$: '-/cd/tickets',
            id: 'd9c37e5b-4df1-47d4-bd43-226fbc29d955',
            sessionId: 'dc666f88-b14e-44f5-b76a-08e8e62c0e25',
            name: 'Mentor',
            type: 'mentor',
            quantity: 2,
            deleted: 0,
            invites: null,
            totalApplications: 0,
            approvedApplications: 0
          }
        ]
      }
    ]
  },
  {
    entity$: '-/cd/events',
    id: '63636e6d-da21-407f-9d73-f553ab8a1ab2',
    name: 'Sri Lannnka',
    country: {
      countryName: 'Sri Lanka',
      countryNumber: 92,
      continent: 'ASIA',
      alpha2: 'LK',
      alpha3: 'LK'
    },
    city: {
      nameWithHierarchy: 'Ganewalpola'
    },
    address: 'Ganewalpola',
    createdAt: '2017-05-29T13:53:16.502Z',
    createdBy: 'e73a4435-fcd2-4578-b081-bb9ae004f83b',
    type: 'one-off',
    description: '<p>LEARN ALL THE THINGS</p>\n',
    dojoId: 'bkr5hk4a9-78gf-9b44-63h2-6gtgfbqy0lkx',
    eventbriteId: 'k2ivy3lc-9ebc-p0bn-gcvd-bb9ae0048h33',
    eventbriteUrl: 'www.eventbrite.com',
    position: null,
    public: true,
    status: 'published',
    recurringType: 'weekly',
    dates: [
      {
        startTime: moment.utc({ hour: 16, minute: 30, second: 0}).subtract(3, 'd').toISOString(),
        endTime: moment.utc({ hour: 17, minute: 30, second: 0}).subtract(3, 'd').toISOString()
      }
    ],
    ticketApproval: true,
    sessions: [
      {
        entity$: '-/cd/sessions',
        id: 'dc666f88-b14e-44f5-b76a-08e8e62c0e25',
        name: 'Hardware',
        description: 'Advanced',
        eventId: '63636e6d-da21-407f-9d73-f553ab8a1ab2',
        status: 'active',
        tickets: [
          {
            entity$: '-/cd/tickets',
            id: 'a8b2a03a-c742-4388-b195-469397eb0er4',
            sessionId: 'dc666f88-b14e-44f5-b76a-08e8e62c0e25',
            name: 'Ninja',
            type: 'ninja',
            quantity: 2,
            deleted: 0,
            invites: null,
          },
        ],
      },
    ],
  },
];
