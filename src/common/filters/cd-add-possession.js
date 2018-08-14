export default (firstName) => {
  if (firstName) {
    return ` – ${firstName}`;
  }
  return firstName;
};
