import { TextInputComponent } from './TextInput';
import { html } from 'lit-html';

export default {
  title: 'Components/Inputs/TextInput',
  component: 'in-textinput',
};

const validators = {
  username: {
    validations: [
      {
        flag: {
          valueMissing: true,
        },
        message: 'Error: Required',
        condition: (input) => input.required && input.value.length <= 0,
      },
    ],
  },
};

const PrimaryTemplate = ({ onValidate, validators }) => {
  setTimeout(() => {
    const input = document.querySelector(`[name="username"]`);
    input.$validator = validators['username'];
  }, 0);
  return html`
    <form @validate="${onValidate}">
      <in-textinput name="username" required />
    </form>
  `;
};

export const Primary = PrimaryTemplate.bind({});

Primary.args = {
  validators,
  onValidate: (ev) => {
    if (!document.querySelector(`[name="username"]`).validity.valid) {
      console.warn('INVALID');
    } else {
      console.log('VALID');
    }
  },
};

const DisabledTemplate = () => {
  return html`
    <in-textinput value="disabled input" disabled name="test-input" />
  `;
};

export const Disabled = DisabledTemplate.bind({});

Disabled.args = {};

const ErrorTemplate = ({}) => {
  setTimeout(() => {
    const input = document.querySelector(`[name="username"]`);
    input.$validator = validators['username'];
    input.focus();
    input.blur();
  }, 0);
  return html`
    <in-textinput
      type="text"
      id="username"
      name="username"
      required
      class="form-control"
    />
  `;
};

export const Error = ErrorTemplate.bind({});

Error.args = {};
