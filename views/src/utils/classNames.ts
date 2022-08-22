export const setClassNames = (classNames: (string | undefined)[]) => {
  const result = classNames.map(value => value || '');

  return [...new Set(result)].join(' ');
};
