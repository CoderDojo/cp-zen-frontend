export default {
  hasPermission(usersDojos, permission) {
    const dojosWithPermissions = usersDojos
      .filter(usersDojo => usersDojo.userPermissions !== null);

    return dojosWithPermissions.find(usersDojo =>
      usersDojo.userPermissions.find(perm => perm.name === permission));
  },
};
