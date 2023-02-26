import { Component, attachTemplate, attachStyle, html, css } from '@in/common';

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
  style: css``,
  template: html`
    <thead></thead>
    <tbody></tbody>
  `,
})
export class TableComponent extends HTMLTableElement {
  constructor() {
    super();
    attachTemplate(this);
    attachStyle(this);
  }
}
