import { html } from 'lit-html';

export type Validator = {
  validations: {
    flag: ValidityStateFlags;
    condition: (elem: HTMLElement) => boolean;
    message?: string;
  }[];
};

export function validate(elem: any, showError: boolean) {
  if (!elem.$validator || !elem.$validator.validations) {
    return;
  }

  const activeValidators = [];

  elem.$validator.validations.forEach((validator) => {
    if (validator.condition(elem)) {
      elem.setValidity(validator.flag, validator.message);
      activeValidators.push(validator);
    }
  });

  if (!activeValidators.length) {
    elem.setValidity({});
  }

  elem.dispatchEvent(new CustomEvent('validate', { bubbles: true }));
}
