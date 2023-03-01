import { Component, Listen } from '@in/common';

@Component({
  selector: 'in-tr',
  custom: { extends: 'tr' },
})
export class TrComponent extends HTMLTableRowElement {
  // create a public property which will hold the data for this row in an object, so that the parent TableComponent can access it in edit mode
  public $rowData: any;
  constructor() {
    super();
  }

  // listen for the custom 'data' event dispatched from this component in the renderRows() method of the parent TableComponent
  @Listen('data')
  setValue(ev: CustomEvent) {
    this.$rowData = ev.detail;
  }

  // update the relevant property on our rowData object
  @Listen('patch')
  patchData(ev: CustomEvent) {
    this.$rowData[ev.detail.property] = ev.detail.changes;
  }

  // remove this TrComponent from the table
  @Listen('delete')
  delete() {
    this.parentNode.removeChild(this);
  }
}
