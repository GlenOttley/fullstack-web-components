import { attachShadow, css, html, Component, Listen } from '@in/common';
import { SESSION } from './../../service/session';

const styles = css`
  :host {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100vh;
  }
  #content-root {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    min-width: 320px;
  }
  h4 {
    font-family: var(--font-default);
    font-weight: var(--font-weight-default);
    font-size: var(--font-headline-line-height-sm);
    margin-block-start: 0em;
    margin-block-end: 0em;
    margin-top: var(--margin-lg);
    margin-bottom: var(--margin-lg);
  }
  fieldset {
    border: 0 none;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    padding-block-start: 0em;
    padding-inline-start: 0em;
    padding-inline-end: 0em;
    padding-block-end: 0em;
  }
  legend {
    visibility: hidden;
    height: 0px;
  }
  label {
    display: block;
    font-family: var(--font-default);
    font-size: var(--font-body-sm);
    margin-top: var(--margin-sm);
    margin-bottom: var(--margin-sm);
  }
  button {
    margin-top: var(--margin-md);
  }
`;
const shadowTemplate = html`
  <app-header></app-header>
  <div id="content-root">
    <in-card style="max-width: 320px">
      <h4 slot="header">Login</h4>
      <form
          name="foo"
          slot="content"
      >
        <fieldset>
            <legend>Login Form</legend>
            <label for="username">Username</label>
            <in-textinput
            type="text"
            id="username"
            name="username"
            required
            minlength="5"
            class="form-control"
            ></in-textinput>
            <label for="password">Password</label>
            <in-textinput
            type="password"
            id="password"
            name="password"
            required
            minlength="5"
            class="form-control"
            ></in-textinput>
            <button class="primary submit form-button" is="in-button">Submit</button>
      </form>
    </in-card>
  </div>
`;

@Component({
  selector: 'login-view',
  style: styles,
  template: shadowTemplate,
})
export class LoginView extends HTMLElement {
  constructor() {
    super();
    attachShadow(this);
  }
}
