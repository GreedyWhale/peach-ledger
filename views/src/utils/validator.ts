type FormData = Record<string, any>;

export type Rules<T> = {
  key: keyof T;
  message: string;
  required: boolean | ((_value: T[keyof T]) => boolean);
}[];

type Errors<T> = {
  // eslint-disable-next-line no-unused-vars
  [key in keyof T]?: string[]
};

export const validator = <T extends FormData>(formData: T, rules: Rules<T>): Errors<T> | null => {
  const errors: Errors<T> = {};

  rules.forEach(rule => {
    const value = formData[rule.key];

    if (typeof rule.required === 'boolean') {
      if (value !== 0 && !value) {
        errors[rule.key] = errors[rule.key] || [];
        errors[rule.key]?.push(rule.message);
      }

      return;
    }

    const passed = rule.required(value);
    if (!passed) {
      errors[rule.key] = errors[rule.key] || [];
      errors[rule.key]?.push(rule.message);
    }
  });

  if (Object.keys(errors).length === 0) {
    return null;
  }

  return errors;
};

export const filterErrors = <T>(errors: Errors<T>, reservedKeys: (keyof T)[], mergedKey: keyof T) => {
  // eslint-disable-next-line no-unused-vars
  const result = {} as {[key in typeof reservedKeys[number] | typeof mergedKey]: string[]};

  Object.entries(errors).forEach(item => {
    const [key, value] = item as [keyof T, string[]];
    const isReservedKey = reservedKeys.includes(key);

    if (isReservedKey) {
      result[key] = result[key] || [];
      result[key].push(...value);
    } else if (key !== mergedKey) {
      result[mergedKey] = result[mergedKey] || [];
      result[mergedKey].push(...value);
    }
  });

  return result;
};
