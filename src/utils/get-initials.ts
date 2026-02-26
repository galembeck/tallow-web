export const getInitials = (name?: string, lastname?: string) => {
  if (name && lastname) {
    return `${name.charAt(0)}${lastname.charAt(0)}`.toUpperCase();
  }
  if (name) {
    return name.charAt(0).toUpperCase();
  }
  return "U";
};
