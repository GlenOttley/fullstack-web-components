import { html } from 'lit-html';
import { ButtonComponent } from '../button/Button';
import { DialogComponent } from './Dialog';

export default {
  title: 'Components/Dialog',
  component: 'in-dialog',
};

const DialogTemplate = ({
  targetId,
  targetSelector,
  templateSelector,
  variant,
}) => {
  return html`
    <in-dialog
      target="${targetSelector}"
      template="${templateSelector}"
      variant="${variant}"
    ></in-dialog>
    <button data-dialog-id="${targetId}" is="in-button" class="primary">
      Open
    </button>
  `;
};

export const Primary = DialogTemplate.bind({});
Primary.args = {
  targetId: 'dialog-hello-target',
  targetSelector: '[data-dialog-id="dialog-hello-target"]',
  templateSelector: '[data-template-id="dialog-hello"]',
  variant: 'modal',
};

// export { ButtonComponent, DialogComponent };
