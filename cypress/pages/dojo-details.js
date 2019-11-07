
function section(index) {
  return {
    label: `.cd-dojo-details__left-column>div:nth-child(${index}) .cd-info-column-section__header .cd-info-column-section__header-text`,
    content: `.cd-dojo-details__left-column>div:nth-child(${index}) .cd-info-column-section__content`,
  };
}

export default {
  name: '.cd-dojo-details__name',
  column: {
    // Calendar
    calendarLink: '.cd-info-column-section.cd-dojo-details__left-column-section .cd-ics-link summary',
    calendarInput: '.cd-info-column-section.cd-dojo-details__left-column-section .cd-ics-link input',
    calendarCopyBtn: '.cd-info-column-section.cd-dojo-details__left-column-section .cd-ics-link button',
    calendarOpenBtn: '.cd-info-column-section.cd-dojo-details__left-column-section .cd-ics-link a',
    time: section(1),
    location: section(2),
    email: section(3),
    website: section(4),
    social: {
      facebook: '.cd-dojo-details__social-media-icon.cd-dojo-details__facebook',
      twitter: '.cd-dojo-details__social-media-icon.cd-dojo-details__twitter',
      googleGroup: '.cd-dojo-details__social-media-icon.cd-dojo-details__google-group',
    },
  },
  map: 'img.cd-dojo-details__static-map',
  details: {
    heading: '.cd-dojo-details__section .cd-dojo-details__heading',
    content: '.cd-dojo-details__section .cd-dojo-details__details',
  },
  sponsors: {
    heading: '.cd-dojo-details__section .cd-dojo-details__heading',
    content: '.cd-dojo-details__section .cd-dojo-details__sponsor-image',
  },
  noEvents: '.cd-event-list__no-events-content',
  events: function (index) {
    const prefix = `.cd-event-list__events > div:nth-child(${index})`; 
    return {
      name: `${prefix} .cd-event-list-item__name`,
      sessions: `${prefix} .cd-event-list-item__sessions`,
      date: `${prefix} .cd-event-list-item__date-timestamp`,
      time: `${prefix} .cd-event-list-item__times-timestamp`,
    };
  },
};
