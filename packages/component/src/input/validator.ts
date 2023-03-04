import { ValidityStateFlags } from 'types/lib.elementInternals';

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

  const messageElem = elem.shadowRoot.querySelector('.message');

  if (messageElem) {
    messageElem.innerHTML = '';
  }

  const activeValidators = [];

  elem.$validator.validations.forEach((validator) => {
    // if the input fails the condition
    if (validator.condition(elem)) {
      elem.setValidity(validator.flag, validator.message);
      activeValidators.push(validator);

      // display the error to the user
      if (showError) {
        if (elem.$input) {
          elem.$input.setAttribute('aria-invalid', 'true');
          elem.$input.classList.add('error');
        }
        if (messageElem) {
          const div = document.createElement('div');
          div.innerHTML = validator.message;
          messageElem.appendChild(div);
        }
      }
    }
  });

  // if the element passes all validations, marks the input valid and clears all errors
  if (!activeValidators.length) {
    elem.setValidity({});
    if (elem.$input) {
      elem.$input.classList.remove('error');
    }
    if (messageElem) {
      messageElem.innerHTML = '';
    }
  }

  // dispatch a custom event from our custom element called 'validate' which will bubble up to the containing form element
  elem.dispatchEvent(new CustomEvent('validate', { bubbles: true }));
}
