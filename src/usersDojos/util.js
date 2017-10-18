export default {
  hasPermission(usersDojos, permission) {
    return usersDojos.find(usersDojo =>
      usersDojo.userPermissions.find(perm => perm.name === permission));
  },
};
