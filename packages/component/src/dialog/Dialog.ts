import { Component, attachShadow, css } from '@in/common';

@Component({
  selector: 'in-dialog',
  style: css`
    :host {
      display: none;
    }
  `,
})
export class DialogComponent extends HTMLElement {
  public $state: 'open' | 'closed';
  // the element (button) that triggers the opening of the dialog
  public $target: Element;
  // the selector for the $target (button) element
  public $targetSelector: string;
  // the selector of the the dialog template
  public $templateSelector: string;
  public $variant: 'modal' | 'tooltip';
  // the instance of the dialog that will be displayed
  public $container: Element;

  constructor() {
    super();
    attachShadow(this, {
      mode: 'open',
    });
  }

  static get observedAttributes() {
    return ['target', 'template', 'variant'];
  }

  attributeChangedCallback(name, prev, next) {
    switch (name) {
      case 'template':
        this.$templateSelector = next;
        break;
      case 'variant':
        this.$variant = next;
        break;
      case 'target':
        setTimeout(() => {
          this.setTarget(next);
        }, 0);
        break;
    }
  }

  setTarget(selector: string) {
    this.$targetSelector = selector;
    this.$target = document.querySelector(this.$targetSelector);

    if (!this.$target) {
      console.error(
        `DialogComponent cannot find Element with selector ${selector}`
      );
      return;
    }

    this.$target.addEventListener(
      'click',
      this.targetListener.bind(this),
      false
    );
  }
  0;

  targetListener(ev: MouseEvent) {
    if (this.$state !== 'open') {
      this.onOpen();
    }
  }

  onOpen() {
    const template = document.querySelector(
      this.$templateSelector
    ) as HTMLTemplateElement;

    if (!template) {
      console.error(
        `DialogComponent cannot find HTMLTemplateElement with selector ${this.$templateSelector}`
      );
      return;
    }

    this.$container = document.createElement('div');
    const clone = this.$container.cloneNode(true) as HTMLElement;
    this.$container.classList.add(this.$variant);
    this.$container.appendChild(clone);
    document.body.appendChild(this.$container);

    this.$state = 'open';
  }
}
