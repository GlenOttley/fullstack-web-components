import { query } from '@in/common';

export class DialogStack {
  stack: Element[] = [];
  templateId: string[] = [];
  last: Element;
  focused: Element;
  constructor() {
    this.addListeners();
  }

  // handle the registration and removal of template ids
  registerTemplate(id: string) {
    if (!this.templateId.includes(id)) {
      this.templateId.push(id);
    }
  }

  // remove an id from the templateId array
  removeTemplate(id: string) {
    const templateIndex = this.findTemplateIndex(id);
    if (templateIndex) {
      this.templateId.splice(templateIndex, 1);
    }
  }
  // find the index of a dialog in the dialog stack
  findDialogIndex(element: Element): number {
    return this.stack.findIndex((elem) => elem === element);
  }

  // find the index of an id in templateId array
  findTemplateIndex(id: string) {
    return this.templateId.findIndex((templateId) => templateId === id);
  }

  focusDialog(element: Element) {
    this.last = this.focused;
    this.focused = element;
  }

  // add a dialog to the stack array
  pushDialog(element: Element) {
    this.stack.push(element);
    document.body.appendChild(element);
    this.setZIndices();
    // focus the new DialogComponent
    this.focusDialog(element);
  }

  // remove dialog from the stack, then dispatch close event to the DialogComponent instance
  removeDialog(element: Element) {
    const id = element.getAttribute('data-dialog-id');
    const target = query(`[data-target-id="${id}"`);
    if (target) {
      target.dispatchEvent(new CustomEvent('close'));
    }
    this.stack.splice(this.findDialogIndex(element), 1);
    document.body.removeChild(element);
    this.setZIndices();
    // focus the dialog that was previously below this one in the stack
    this.focusDialog(this.stack[this.stack.length - 1]);
  }

  // add z-index property to each dialog in the stack, assigning a higher value to more recently added dialogs
  setZIndices() {
    const base = 9000;
    this.stack.forEach((element, index) => {
      (element as HTMLElement).style.zIndex = (base + index * 10).toString();
    });
  }

  // attach event listener to document.body for closing modal on click outside
  addListeners() {
    document.body.addEventListener('click', this.onFocus.bind(this));
  }

  onFocus(ev: MouseEvent) {
    // this will be the tooltip component if the user clicks on the tooltip itself
    const closest = (ev.target as Element).closest('[data-dialog-id]');
    if (
      closest == null &&
      this.focused &&
      this.focused.tagName === 'IN-TOOLTIP'
    ) {
      this.removeDialog(this.focused);
    }
  }
}
