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
      <in-textinput name="username" required></in-textinput>
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
