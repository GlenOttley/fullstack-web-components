import { Component, attachShadow, html, css } from '@in/common';

const styles = css`
  :host {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100vh;
  }
  #content-root {
    overflow-y: scroll;
  }
`;

const shadowTemplate = html`
  <app-header></app-header>
  <div id="content-root">Content</div>
  <footer>Footer</footer>
`;

@Component({
  selector: 'main-view',
  style: styles,
  template: shadowTemplate,
})
export class MainView extends HTMLElement {
  constructor() {
    super();
    attachShadow(this);
  }
}
