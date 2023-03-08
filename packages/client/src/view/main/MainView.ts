import { Component, attachShadow, html, css } from '@in/common';
import { CookieService, COOKIES } from '../../service/cookies';

const cookieService = new CookieService();

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
  <cookie-footer></cookie-footer>
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

  connectedCallback() {
    cookieService.getPermission().then((cookies) => {
      if (cookies.permission === COOKIES.ACCEPT) {
        this.$cookieFooter.setAttribute('hidden', 'true');
      } else {
        this.$cookieFooter.removeAttribute('hidden');
      }
    });
  }

  get $cookieFooter() {
    return this.shadowRoot.querySelector('cookie-footer');
  }
}
