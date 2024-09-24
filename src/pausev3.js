import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';

class EnhancedPauseComponent extends LitElement {
  static properties = {
    visibleContent: { type: Number },
    showButtons: { type: Boolean },
    showAllOption: { type: Boolean }
  };

  static styles = css`
    :host {
      display: block;
      font-family: Arial, sans-serif;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f0f0f0;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .content {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.7s ease-out;
    }
    .content.visible {
      max-height: 500px;
    }
    .button-container {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin-top: 20px;
    }
    button {
      display: flex;
      align-items: center;
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      font-size: 16px;
      cursor: pointer;
      transition: all 0.3s ease;
      background-color: #4a5568;
      color: white;
      margin-right: 10px;
    }
    button:hover {
      background-color: #2d3748;
    }
    .arrow-down {
      width: 0; 
      height: 0; 
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
      border-top: 5px solid #4a5568;
      cursor: pointer;
      transition: transform 0.3s ease;
    }
    .arrow-down:hover {
      transform: translateY(2px);
    }
    .show-all {
      display: none;
      background-color: #48bb78;
      color: white;
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      font-size: 16px;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    .show-all.visible {
      display: inline-block;
    }
    .show-all:hover {
      background-color: #38a169;
    }
  `;

  constructor() {
    super();
    this.visibleContent = 1;
    this.showButtons = true;
    this.showAllOption = false;
  }

  render() {
    return html`
      ${this.renderContent()}
      ${this.showButtons ? this.renderButtons() : ''}
    `;
  }

  renderContent() {
    return html`
      <div class="content ${this.visibleContent >= 1 ? 'visible' : ''}"><slot name="content-1"></slot></div>
      <div class="content ${this.visibleContent >= 2 ? 'visible' : ''}"><slot name="content-2"></slot></div>
      <div class="content ${this.visibleContent >= 3 ? 'visible' : ''}"><slot name="content-3"></slot></div>
      <div class="content ${this.visibleContent >= 4 ? 'visible' : ''}"><slot name="content-4"></slot></div>
    `;
  }

  renderButtons() {
    return html`
      <div class="button-container">
        <button @click=${this.handlePause}>
          Pause
        </button>
        <div class="arrow-down" @click=${this.toggleShowAll}></div>
        <button class="show-all ${this.showAllOption ? 'visible' : ''}" @click=${this.showAll}>
          Show All
        </button>
      </div>
    `;
  }

  handlePause() {
    if (this.visibleContent < 3) {
      this.visibleContent++;
    } else {
      this.visibleContent = 4;
      this.showButtons = false;
    }
  }

  toggleShowAll() {
    this.showAllOption = !this.showAllOption;
  }

  showAll() {
    this.visibleContent = 4;
    this.showButtons = false;
  }
}

customElements.define('enhanced-pause-component', EnhancedPauseComponent);