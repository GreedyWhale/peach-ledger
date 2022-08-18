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
