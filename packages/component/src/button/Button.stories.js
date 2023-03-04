import { ButtonComponent } from './Button.ts';
import { html } from 'lit-html';

let icon = null;
let svg;

if (window.FontAwesome) {
  icon = window.FontAwesome.icon({ prefix: 'fas', iconName: 'times' });
  svg = icon.node[0];
  svg.setAttribute('aria-hidden', 'true');
}

export default {
  title: 'Components/Inputs/Button',
  component: 'in-button',
};

const Template = ({ label, variant }) => {
  return html` <button class="${variant}" is="in-button">${label}</button> `;
};

export const Primary = Template.bind({});
Primary.args = {
  variant: 'primary',
  label: 'Submit',
};

export const Secondary = Template.bind({});
Secondary.args = {
  variant: 'secondary',
  label: 'Submit',
};

const IconTemplate = ({ label, variant, svg }) => {
  return html`
    <button
      class="${variant}"
      is="in-button"
      aria-labelledby="close-button-label"
    >
      <span hidden id="close-button-label">${label}</span>
      ${svg}
    </button>
  `;
};

export const Icon = IconTemplate.bind({});
Icon.args = {
  variant: 'icon',
  label: 'Close',
  svg: svg,
};

const DisabledTemplate = ({ label, variant }) => {
  return html`
    <button class="${variant}" is="in-button" disabled>${label}</button>
  `;
};

export const Disabled = DisabledTemplate.bind({});
Disabled.args = {
  variant: 'primary',
  label: 'Submit',
};
