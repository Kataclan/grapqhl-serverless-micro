export const getClassDisplayName = (zeniClass: ZeniClasses): string =>
  zeniClass.charAt(0).toUpperCase() + zeniClass.slice(1);
