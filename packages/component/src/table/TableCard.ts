import { Component, attachShadow, Listen, html, css } from '@in/common';

@Component({
  selector: 'in-tablecard',
  style: css`
    :host .primary[is='in-button'],
    :host .secondary[is='in-button'] {
      min-width: 160px;
      margin-left: var(--margin-lg);
    }

    .table-footer {
      display: flex;
      justify-content: space-between;
      padding-top: var(--padding-md);
    }

    [hidden] {
      display: none;
    }
  `,
  template: html`
    <in-card>
      <table is="in-table" slot="content"></table>
      <div class="table-footer" slot="footer">
        <div class="crud-actions"></div>
        <div class="save-actions">
          <button class="primary button-save" is="in-button" hidden>
            save
          </button>
          <button class="secondary button-cancel" is="in-button" hidden>
            cancel
          </button>
          <button class="secondary button-edit" is="in-button">edit</button>
        </div>
      </div>
    </in-card>
  `,
})
export class TableCardComponent extends HTMLElement {
  // the channel property of this component, this is different from the 'channel' attribute we set on the element
  private channel: BroadcastChannel;
  constructor() {
    super();
    attachShadow(this, { mode: 'open' });
  }

  connectedCallback() {
    const addButtonTemplate: HTMLTemplateElement = document.querySelector(
      '[data-template-id="button-add"]'
    );
    this.$crudActions.appendChild(addButtonTemplate.content.cloneNode(true));
  }

  // listen for changes on the channel attribute
  static get observedAttributes() {
    return ['channel'];
  }

  attributeChangedCallback(name, prev, next) {
    switch (name) {
      case 'channel':
        // create a new BroadcastChannel with the value of the channel attribute and assign it to the channel property
        this.channel = new BroadcastChannel(next);
        // set the channel attribute on the child TableComponent with the value of the channel attribute on the TableCardComponent
        this.$table.setAttribute('channel', next);
        break;
    }
  }

  @Listen('click', '.button-cancel')
  readOnlyMode() {
    this.$editButton.removeAttribute('hidden');
    this.$saveButton.setAttribute('hidden', 'true');
    this.$cancelButton.setAttribute('hidden', 'true');
    // post a 'readOnly' message via the channel object, no payload is needed here since this simply acts like an on switch
    this.channel.postMessage({
      type: 'readOnly',
    });
  }

  @Listen('click', '.button-edit')
  editMode() {
    this.$editButton.setAttribute('hidden', 'true');
    this.$saveButton.removeAttribute('hidden');
    this.$cancelButton.removeAttribute('hidden');
    // post an 'edit' message via the channel object, no payload is needed here since this simply acts like an on switch
    this.channel.postMessage({
      type: 'edit',
    });
  }

  @Listen('click', '.button-save')
  save() {
    // post a 'save' message via the channel object, no payload is needed here since this simply acts like an on switch
    this.channel.postMessage({
      type: 'save',
    });
    // call the readOnlyMode function which will handle hiding and showing the appropriate buttons and associated table behaviour
    this.readOnlyMode();
  }

  @Listen('click', '.button-add')
  add() {
    // remove focus from the add button
    // do we need this?
    this.$addButton.blur();
    this.$editButton.setAttribute('hidden', 'true');
    this.$saveButton.removeAttribute('hidden');
    this.$cancelButton.removeAttribute('hidden');
    // post an 'add' message via the channel object, no payload is needed here since this simply acts like an on switch
    this.channel.postMessage({
      type: 'add',
    });
  }

  // element getters using the shadowRoot because TableCardComponent is an autonomous custom element
  get $table(): HTMLTableElement {
    return this.shadowRoot.querySelector('table');
  }
  get $crudActions(): HTMLElement {
    return this.shadowRoot.querySelector('.crud-actions');
  }
  get $addButton(): HTMLElement {
    return this.shadowRoot.querySelector('.button-add');
  }
  get $editButton(): HTMLElement {
    return this.shadowRoot.querySelector('.button-edit');
  }
  get $saveButton(): HTMLElement {
    return this.shadowRoot.querySelector('.button-save');
  }
  get $cancelButton(): HTMLElement {
    return this.shadowRoot.querySelector('.button-cancel');
  }
}
