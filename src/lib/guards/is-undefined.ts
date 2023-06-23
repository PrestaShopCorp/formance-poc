export const isUndefined = (value: undefined | unknown): value is undefined => {
  return value === undefined || value === null || value === 'undefined';
};
