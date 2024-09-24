import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';

class EnhancedMultipleChoiceComponent extends LitElement {
  static properties = {
    // singleOption: { type: Boolean },
    question: { type: String },
    randomize: { type: Boolean },
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
    .question {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 15px;
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
    // this.singleOption = false;
    this.question = '';
    this.randomize = false;
    this.visibleContent = 1;
    this.showButtons = true;
    this.showAllOption = false;
    this.options = [];
  }

  firstUpdated() {
    this.options = Array.from(this.querySelectorAll('web-element')).map(el => ({
      label: el.getAttribute('label'),
      content: el.innerHTML
    }));

    // if (this.randomize) {
    //   this.options = this.shuffleArray(this.options);
    // }
  }

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  render() {
    return html`
      <div class="question">${this.question}</div>
      ${this.renderContent()}
      ${this.showButtons ? this.renderButtons() : ''}
    `;
  }

  renderContent() {
    return html`
      ${this.options.slice(0, this.visibleContent).map((option, index) => html`
        <div class="content visible">
          <h3>${option.label}</h3>
          <div>${option.content}</div>
        </div>
      `)}
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
    if (this.visibleContent < this.options.length) {
      this.visibleContent++;
    } else {
      this.visibleContent = 1;
      this.showButtons = false;
    }
  }

  toggleShowAll() {
    this.showAllOption = !this.showAllOption;
  }

  showAll() {
    this.visibleContent = this.options.length;
    this.showButtons = false;
  }
}

customElements.define('enhanced-multiple-choice', EnhancedMultipleChoiceComponent);