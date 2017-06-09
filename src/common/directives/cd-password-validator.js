export default {
  getMessage: () => 'The password should be at least 8 characters and contain at least one numeric character.',
  validate: value => (value ? value.length > 7 && /.*[0-9].*/.test(value) : false),
};
