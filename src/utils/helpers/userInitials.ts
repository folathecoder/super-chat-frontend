const userInitials = (firstName?: string, lastName?: string) => {
  if (firstName && lastName) {
    return `${firstName[0]}${lastName[0]}`;
  } else {
    return 'U';
  }
};

export default userInitials;
