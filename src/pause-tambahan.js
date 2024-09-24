import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';

class PauseContainer extends LitElement {
  static properties = {
    showAllContent: { type: Boolean }
  };

  static styles = css`
    :host {
      display: block;
      max-width: 800px;
      margin: 0 auto;
    }
  `;

  constructor() {
    super();
    this.showAllContent = false;
  }

  render() {
    return html`
      <slot @show-all=${this.handleShowAll}></slot>
    `;
  }

  handleShowAll() {
    this.showAllContent = true;
    const components = this.querySelectorAll('enhanced-pause-component');
    components.forEach(component => {
      component.visibleContent = true;
      component.showButtons = false;
    });
  }
}

customElements.define('pause-container', PauseContainer);