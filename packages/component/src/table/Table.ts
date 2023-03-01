import { Component, attachTemplate, attachStyle, html, css } from '@in/common';
import { TdComponent } from './Td';
import { TrComponent } from './Tr';

export interface Column {
  property: string;
  label: string;
  span?: number;
  align: 'left' | 'center' | 'right' | 'justify';
  index: number;
}

export type ColumnData = Column[];

@Component({
  selector: 'in-table',
  custom: { extends: 'table' },
  style: css`
    [is='in-table'] {
      font-family: var(--font-default);
      font-size: var(--font-body-md);
      font-weight: var(--font-weight-default);
      color: var(--color-neutral-500);
      width: 100%;
    }
    [is='in-table'] th {
      display: table-cell;
      box-sizing: border-box;
      margin-top: var(--margin-xs);
      padding-left: calc(var(--padding-xxs) + var(--padding-sm));
      padding-right: var(--padding-xxs);
      height: 44px;
      vertical-align: middle;
      font-weight: var(--font-weight-default);
    }
    [is='in-table'] tr {
      height: 58px;
      vertical-align: middle;
    }
    [is='in-table'] td {
      padding-left: var(--padding-xxs);
      padding-right: var(--padding-xxs);
    }
    [is='in-table'] td.delete-cell button {
      transform: translateY(-2px);
    }
    [is='in-table'] td.delete-cell[readonly='true'] {
      display: none;
    }
    [is='in-table'] td:first-child {
      padding-left: var(--padding-lg);
    }
    [is='in-table'] th:first-child {
      padding-left: calc(var(--padding-lg) + var(--padding-sm));
    }
    [is='in-table'] th:last-child,
    [is='in-table'] td:last-child {
      padding-right: var(--padding-lg);
    }
  `,
  template: html`
    <thead></thead>
    <tbody></tbody>
  `,
})
export class TableComponent extends HTMLTableElement {
  // the channel property of this component, this is different from the 'channel' attribute we set on the element
  private channel: BroadcastChannel;
  // store our column data to be referenced in both the renderHeader() and renderRows() methods
  private columnData: ColumnData;
  // this is where we will store our array of row data, from our trComponent
  // this will be used in edit mode to store the current state of the rows before editing
  private savedState: any[];
  // the index of the cell currently being edited
  private editIndex: number = 0;
  // this will store row data for newly created rows before they are saved
  private blankRowData: any;
  constructor() {
    super();
    attachTemplate(this);
    attachStyle(this);
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
        // assign the onMessage() function to the onmessage property of the channel object
        // bind(this) makes the TableComponent the context of the onMessage function
        this.channel.onmessage = this.onMessage.bind(this);
        break;
    }
  }

  // will be invoked when there are changes on the channel object
  onMessage(ev) {
    // check the type of the message being received on the channel object then call the appropriate function
    switch (ev.data.type) {
      case 'data':
        this.onTableData(ev.data.detail);
        break;
      case 'add':
        this.onAdd();
        break;
      case 'edit':
        this.onEdit();
        break;
      case 'readOnly':
        this.onReadOnly();
        break;
      case 'save':
        this.onSave();
        break;
    }
  }

  onAdd() {
    if (!this.savedState) {
      // copy and save the current state of the table
      this.savedState = JSON.parse(JSON.stringify(this.state));
    }
    const rowData = this.blankRowData;

    const tr = document.createElement('tr', { is: 'in-tr' });

    // create a custom tdComponent for each object in the columnData array
    this.columnData.forEach((colData) => {
      const td = document.createElement('td', { is: 'in-td' });
      if (colData.align) {
        td.align = colData.align;
      }
      // set the tdComponents data-property attribute equal to the relevent column property
      // this is needed to track changes to the input in edit mode
      td.setAttribute('data-property', colData.property);
      // set the tdComponents value attribute equal to the relevant value based on the column heading
      // this will be used to set the inner text inside the the custom tdComponent
      td.setAttribute('value', rowData[colData.property]);
      // set the td element as editable
      td.setAttribute('readonly', 'false');
      tr.appendChild(td);
    });
    // append delete button to the tr element
    this.createDeleteButton(tr);
    // append the tr element to the table body
    this.$body.appendChild(tr);
    // dispatch a 'data' event on our custom trComponent, passing in the current row data
    tr.dispatchEvent(
      new CustomEvent('data', {
        detail: rowData,
      })
    );
    // pass the handleCellListeners function to each tdComponent, binding the tableComponent as the context with 'this'
    this.$cells.forEach(this.handleCellListeners.bind(this));

    // set the edit index to the index of the first TdComponent in the blank row
    this.editIndex = Array.from(this.$cells).indexOf(
      tr.children[0] as HTMLTableCellElement
    );
    // focus the first input when edit mode is initiated
    this.onNext();
  }

  onEdit() {
    if (!this.savedState) {
      // copy and save the current state of the table
      this.savedState = JSON.parse(JSON.stringify(this.state));
    }
    // pass the handleCellListeners function to each tdComponent, binding the tableComponent as the context with 'this'
    this.$cells.forEach(this.handleCellListeners.bind(this));
    // focus the first input when edit mode is initiated
    this.onNext();
  }

  onReadOnly() {
    this.$cells.forEach((td) => {
      td.setAttribute('readonly', 'true');
    });
    if (this.savedState) {
      // reset the rows back to their previous state after the user presses the cancel button, then clear the saved state
      this.renderRows(this.savedState);
      this.savedState = undefined;
    }
    // set the edit index to 0 in preparation for when editMode() is called again
    this.editIndex = 0;
  }

  onSave() {
    // save the current table state in a scoped variable
    // do we need this? (could we not just access this.state directly?)
    const data: TrComponent[] = this.state;

    // set the readonly attribute to true on the cell that was last edited
    // do we need this? (all cells will be set to readonly in renderRows called below)
    if (this.$cells[this.editIndex]) {
      this.$cells[this.editIndex].setAttribute('readonly', 'true');
    }

    // reset the savedState and editIndex
    this.savedState = undefined;
    // do we need this? (already being handled inside onReadOnly)
    this.editIndex = 0;

    const validRows = this.validateRows(data);

    // post a 'change' message on the channel object, which will be listened for outside of the context of TableComponent
    this.channel.postMessage({
      type: 'change',
      detail: validRows,
    });

    this.renderRows(validRows);
  }

  // method for reacting to the 'data' message type
  // 'next' is the data.detail which contains the column and row data
  onTableData(next) {
    this.renderHeader(next.columnData);
    this.renderRows(next.rowData);
  }

  // method for adding delete button to table row
  createDeleteButton(tr) {
    const deleteButtonTd = document.createElement('td');
    deleteButtonTd.classList.add('delete-cell');
    deleteButtonTd.setAttribute('readonly', 'true');
    // get the delete button template defined in client/src/template.html
    const deleteButtonTemplate: HTMLTemplateElement = document.querySelector(
      '[data-template-id="button-delete"]'
    );
    // clone and append the delete button template to the table row that was passed
    deleteButtonTd.appendChild(deleteButtonTemplate.content.cloneNode(true));
    tr.appendChild(deleteButtonTd);
  }

  // method for handling mouse and keyboard events on our textInputComponent within each cell
  handleCellListeners(td: TdComponent, index: number) {
    // get the parent trComponent of the tdComponent
    const tr = td.parentNode as TrComponent;
    // get the child textInputComponent of the tdComponent
    const input = td.querySelector('in-textinput') as HTMLInputElement;
    // query for the delete button
    const button = td.querySelector('[is="in-button"]') as HTMLButtonElement;
    // check if the textInputComponent exists (we may choose to add elements other than textInputComponent inside our tdComponent later)
    if (input) {
      // set the textInputComponents value equal to that of the 'value' attribute on its parent tdComponent
      input.value = td.getAttribute('value');
      // set the readonly attribute to false, thus hiding the cells text content and displaying its input component
      td.setAttribute('readonly', 'false');
      // set the edit index equal to the index of the tdComponent currently being edited
      input.onclick = (ev) => {
        this.editIndex = Array.from(this.$cells).indexOf(td);
      };

      input.onkeyup = (ev) => {
        // set the tdComponents value equal to the current state on the input whenever a key is pressed
        td.setAttribute('value', input.value);
        // dispatch a custom patch event on the trComponent with the updated cell information
        tr.dispatchEvent(
          new CustomEvent('patch', {
            detail: {
              property: td.dataset.property,
              changes: td.getAttribute('value'),
            },
          })
        );
      };

      input.onkeydown = (ev) => {
        // prevent the browsers default event bubbling
        ev.stopPropagation();
        if (ev.key === 'Tab') {
          // on tab, set the edit index to that of the cell currently being edited
          this.editIndex = index;
          // focus the next input
          this.onNext();
        }
      };
    }
    // if the current td element has a delete button
    if (button) {
      // show the button
      td.setAttribute('readonly', 'false');
      // on click, dispatch a custom delete event on the cells parent trComponent
      button.onclick = () => {
        this.editIndex = index;
        td.parentNode.dispatchEvent(new CustomEvent('delete'));
      };
      // on enter or select keys, dispatch a custom delete event on the cells parent trComponent
      button.onkeydown = (ev) => {
        ev.stopPropagation();
        if (ev.key === 'Tab') {
          this.editIndex = index;
          this.onNext();
        }
        if (ev.key === 'Enter' || ev.key === 'Select') {
          this.editIndex = index;
          this.onNext();
          td.parentNode.dispatchEvent(new CustomEvent('delete'));
        }
      };
    }
  }

  // method for handling focus of the inputs in edit mode
  onNext() {
    // if a cell does not exist at the current edit index, return so no further code is executed
    if (!this.$cells[this.editIndex]) {
      return;
    }
    // focus the child textInputComponent of the cell currently being edited
    const input = this.$cells[this.editIndex].querySelector(
      'in-textinput'
    ) as HTMLInputElement;
    if (input) {
      input.focus();
    }
  }

  renderHeader(cols: ColumnData) {
    // sort the columns properly from left to right based on the index property
    this.columnData = cols.sort((a, b) => a.index - b.index);
    // create a standard tr component which will contain the column heading (th) elements
    const tr = document.createElement('tr');
    // create a column heading (th) element for each object in the columnData array
    cols.forEach((colData) => {
      const th = document.createElement('th');
      th.innerText = colData.label;
      if (colData.span) {
        th.colSpan = colData.span;
      }
      if (colData.align) {
        th.align = colData.align;
      }
      // append the created column heading to the tr element we created
      tr.appendChild(th);
    });
    // clear the current thead element to allow re-rendering with different columns
    this.$head.innerHTML = '';
    // append the tr element to the thead element we created in the TableComponent template
    this.$head.appendChild(tr);
  }

  renderRows(rows: any[]) {
    // clear the tbody element to allow users to replace the data displayed in the table
    this.$body.innerHTML = '';
    // create a custom trComponent for each object in the rows array
    rows.forEach((rowData) => {
      const tr = document.createElement('tr', { is: 'in-tr' });
      // create a custom tdComponent for each object in the columnData array
      this.columnData.forEach((colData) => {
        const td = document.createElement('td', { is: 'in-td' });
        if (colData.align) {
          td.align = colData.align;
        }
        // set the tdComponents data-property attribute equal to the relevent column property
        // this is needed to track changes to the input in edit mode
        td.setAttribute('data-property', colData.property);
        // set the tdComponents value attribute equal to the relevant value based on the column heading
        // this will be used to set the inner text inside the the custom tdComponent
        td.setAttribute('value', rowData[colData.property]);
        // set the td element to readonly on initial render
        td.setAttribute('readonly', 'true');
        // append the td element to the tr element we created
        tr.appendChild(td);
      });
      // append delete button to the tr element
      this.createDeleteButton(tr);
      // append the tr element to the table body
      this.$body.appendChild(tr);
      // dispatch a 'data' event on our custom trComponent, passing in the current row data
      tr.dispatchEvent(
        new CustomEvent('data', {
          detail: rowData,
        })
      );
      this.blankRowData = {};
      this.columnData.forEach((colData) => {
        this.blankRowData[colData.property] = '';
      });
    });
  }

  validateRows(data) {
    return data.filter((rowData) => {
      let hasData: boolean = false;
      for (let key in rowData) {
        if (rowData[key].length > 0) {
          hasData = true;
        }
      }
      return hasData;
    });
  }

  // get an array of current row data objects, accessible on the $rowData property of our custom trComponent
  get state(): TrComponent[] {
    return Array.from(this.querySelector('tbody').querySelectorAll('tr')).map(
      (tr: TrComponent) => tr.$rowData
    );
  }

  // element getters
  get $head() {
    return this.querySelector('thead');
  }
  get $body() {
    return this.querySelector('tbody');
  }
  get $cells() {
    return this.querySelectorAll('td');
  }
}
