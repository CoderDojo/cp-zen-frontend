const moment = require('moment');

module.exports = {
  dojos: [
    {
      entity$: '-/cd/dojos',
      name: 'CD ROM',
      geoPoint: {
        lat: 53.349351,
        lon: -6.247585999999956
      },
      stage: 0,
      urlSlug: 'ie/dublin/cd-rom',
      private: 1,
      id: 'b850b40e-1e10-4e3a-8a46-d076c94946c6',
      address1: 'Pivotal Labs, CHQ building, Dublin 1',
      countryName: 'Ireland',
      email: 'cdrom@example.com',
      facebook: 'DCU',
      googleGroup: null,
      twitter: 'CoderDojo',
      notes: '<h2>Suggested Notes:<br />\n<br />\nPlease bring:</h2>\n\n<ul>\n\t<li>\n\t<h2>A laptop. Borrow one from somebody if needs be.</h2>\n\t</li>\n\t<li>\n\t<h2><strong>A parent! (Very important). If you are 12 or under, your parent must stay with you during the session.</strong></h2>\n\t</li>\n</ul>\n\n<h2>&nbsp;</h2>\n',
      needMentors: 0,
      placeName: 'Dublin',
      frequency: 'other',
      alternativeFrequency: 'Sunday 10am',
      website: null,
      supporterImage: 'http://www.xconomy.com/wordpress/wp-content/images/2013/01/dogpatch-labs-logo.png'
    },
    {
      entity$: '-/cd/dojos',
      name: 'Smithfield Awesome Dojo',
      geoPoint: {
        lat: 53.34899189999999,
        lon: -6.278343100000029
      },
      stage: 0,
      urlSlug: 'ie/smithfield/smithfield-awesome-dojo',
      private: 0,
      id: '4e591bbe-667b-4782-bc9c-180c6d321883',
      address1: 'The square',
      countryName: 'Ireland',
      email: 'smithfield-awesome-dojo.ie@coderdojo.com',
      facebook: null,
      googleGroup: null,
      twitter: null,
      notes: '<p>Suggested Notes:<br />\n<br />\nPlease bring:</p>\n\n<ul>\n\t<li>\n\t<p>A laptop. Borrow one from somebody if needs be.</p>\n\t</li>\n\t<li>\n\t<p><strong>A parent! (Very important). If you are 12 or under, your parent must stay with you during the session.</strong></p>\n\t</li>\n</ul>\n\n<p>&nbsp;</p>\n',
      needMentors: 1,
      placeName: 'Smithfield',
      frequency: 'other',
      alternativeFrequency: 'Saturdays, 5-7pm',
      website: null,
      supporterImage: 'http://www.xconomy.com/wordpress/wp-content/images/2013/01/dogpatch-labs-logo.png'
    },
    {
      entity$: '-/cd/dojos',
      name: 'Dublin Ninja Kids',
      geoPoint: {
        lat: 53.348315,
        lon: -6.248111999999992
      },
      stage: 0,
      urlSlug: 'ie/dublin/dublin-ninja-kids',
      private: 0,
      id: '3ed47c6d-a689-46a0-883b-1f3fd46e9c77',
      address1: 'CHQ Building,1 Custom House Quay, North Dock',
      countryName: 'Ireland',
      email: 'dublinninjakids@gmail.com',
      facebook: 'https://www.facebook.com/CoderDojo',
      googleGroup: 'https://google.group.com/dublinninjakids',
      twitter: 'https://twitter.com/CoderDojo',
      notes: '<p>This is the Dojo details section</p>\n',
      needMentors: 1,
      placeName: 'Dublin',
      frequency: '1/m',
      alternativeFrequency: '3rd',
      day: 4,
      startTime: '10:00',
      endTime: '11:30',
      website: 'www.dublinninjakids.com',
      supporterImage: 'http://www.xconomy.com/wordpress/wp-content/images/2013/01/dogpatch-labs-logo.png'
    },
    {
      entity$: '-/cd/dojos',
      name: 'Super Secret Dojo',
      geoPoint: {
        lat: 53.7278863,
        lon: -7.7986504
      },
      stage: 0,
      urlSlug: 'ie/longford/super-secret-dojo',
      private: 1,
      id: '70e868a9-f2b2-4b73-8f83-7e3a79dfa150',
      address1: 'Longford Shopping Center, Longford',
      countryName: 'Ireland',
      email: 'longforddojo@example.com',
      facebook: null,
      googleGroup: null,
      twitter: null,
      notes: '<p>What\'s the password?</p>\n',
      needMentors: 0,
      placeName: 'Longford',
      frequency: 'other',
      alternativeFrequency: 'For us to know, and you to find out.',
      website: null,
      supporterImage: ''
    },
    {
      entity$: '-/cd/dojos',
      name: 'Eventbrite Dojo',
      geoPoint: {
        lat: 8.128535,
        lon: 80.633043
      },
      stage: 0,
      urlSlug: 'lk/ganewalpola/eventbrite-dojo',
      private: 0,
      id: '70ezk4a9-q0pm-4bk2-8f83-200a799y2k50',
      address1: 'Ganewalpola Road, Ganewalpola',
      countryName: 'Sri Lanka',
      email: 'eventbritedojo@example.com',
      facebook: null,
      googleGroup: null,
      twitter: null,
      notes: '<p>We use Eventbrite!</p>\n',
      needMentors: 1,
      placeName: 'Ganewalpola',
      frequency: 'other',
      alternativeFrequency: 'Saturdays from 4pm to 6pm',
      website: null,
      supporterImage: ''
    },
    {
      entity$: '-/cd/dojos',
      name: 'ASU Dojo',
      geoPoint: {
        lat: 33.608632,
        lon: -112.160143
      },
      stage: 0,
      urlSlug: 'az/phoenix/asu-dojo',
      private: 0,
      id: 'kr5hk4a9-78gf-9b44-63h2-6gtgfbqy0lkm',
      address1: '4701 W. Thunderbird Road, Glendale, AZ 85306, USA',
      countryName: 'USA',
      email: 'asudojo@example.com',
      facebook: null,
      googleGroup: null,
      twitter: null,
      notes: '<p>Our Dojo takes place on the Arizona State University West Campus!</p>\n',
      placeName: 'Phoenix',
      frequency: 'other',
      alternativeFrequency: 'Sundays from 11am to 12pm',
      website: null,
      supporterImage: 'https://askabiologist.asu.edu/sites/all/themes/askabiologist/images/asu-logo.png'
    },
    {
      entity$: '-/cd/dojos',
      name: 'Baker Street Dojo',
      geoPoint: {
        lat: 51.523767,
        lon: -0.158563
      },
      stage: 0,
      urlSlug: 'uk/london/baker-street-dojo',
      private: 1,
      id: '70ge6fa9-221b-ju4r-m2gx-sher777y8utf',
      address1: '221B Baker Street, London',
      countryName: 'United Kingdom',
      email: 'bakerstreetdojo@example.com',
      facebook: null,
      googleGroup: null,
      twitter: null,
      notes: '<p>We host a private dojo in the Sherlock Holmes Museum on Baker Street</p>\n',
      placeName: 'London',
      frequency: 'other',
      alternativeFrequency: 'Every once in a while',
      website: null,
      supporterImage: ''
    },
    {
      entity$: '-/cd/dojos',
      name: 'Louvre Paris Dojo',
      geoPoint: {
        lat: 48.860606,
        lon: 2.337647
      },
      stage: 0,
      urlSlug: 'fr/paris/louvre-dojo',
      private: 0,
      id: 'lgblk4a9-88v4-p2b4-fyta-56fd799p0mjv',
      address1: 'Rue de Rivoli, 75001 Paris, France',
      countryName: 'France',
      email: 'louvredojo@example.com',
      facebook: null,
      googleGroup: null,
      twitter: null,
      notes: '<p>We wrote our dojo details in English even though we speak French!</p>\n',
      placeName: 'Paris',
      frequency: 'other',
      alternativeFrequency: 'Fridays from 2pm to 3:30pm',
      website: null,
      supporterImage: ''
    }
  ],
  events: [
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
      description: '<p>LEARN ALL THE THINGS</p>\n',
      dojoId: '3ed47c6d-a689-46a0-883b-1f3fd46e9c77',
      eventbriteId: null,
      eventbriteUrl: null,
      position: null,
      public: true,
      status: 'published',
      recurringType: 'weekly',
      dates: [
        {
          startTime: moment.utc([2017, 11, 6, 16, 30, 0]).toISOString(),
          endTime: moment.utc([2017, 11, 6, 18, 0, 0]).toISOString()
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
      description: '<p>Learn all the other things</p>\n',
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
          startTime: moment().add(10, 'h').toISOString(),
          endTime: moment().add(12, 'h').toISOString()
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
          startTime: moment().add(7, 'd').add(5, 'h').toISOString(),
          endTime: moment().add(7, 'd').add(7, 'h').toISOString()
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
          startTime: moment().add(14, 'd').add(5, 'h').toISOString(),
          endTime: moment().add(14, 'd').add(7, 'h').toISOString()
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
          startTime: moment().add(3, 'd').add(1, 'h').toISOString(),
          endTime: moment().add(3, 'd').add(2, 'h').toISOString()
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
    }
  ],
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
    },
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
    },
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
    },
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
    },
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
  ],
  'ip-country-details': {
    continent: {
      code: 'EU',
      geoname_id: 6255148,
      names: {
        de: 'Europa',
        en: 'Europe',
        es: 'Europa',
        fr: 'Europe',
        ja: 'ヨーロッパ',
        'pt-BR': 'Europa',
        ru: 'Европа',
        'zh-CN': '欧洲'
      }
    },
    country: {
      geoname_id: 2963597,
      iso_code: 'IE',
      names: {
        de: 'Irland',
        en: 'Ireland',
        es: 'Irlanda',
        fr: 'Irlande',
        ja: 'アイルランド',
        'pt-BR': 'Irlanda',
        ru: 'Ирландия',
        'zh-CN': '爱尔兰'
      },
      tld: '.ie'
    },
    registered_country: {
      geoname_id: 2963597,
      iso_code: 'IE',
      names: {
        de: 'Irland',
        en: 'Ireland',
        es: 'Irlanda',
        fr: 'Irlande',
        ja: 'アイルランド',
        'pt-BR': 'Irlanda',
        ru: 'Ирландия',
        'zh-CN': '爱尔兰'
      },
      tld: '.ie'
    }
  },
  'bulk-apply-applications': []
}
