import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';


class AnimatedPauseComponent extends LitElement {
  static properties = {
    visibleContent: { type: Number },
    showButtons: { type: Boolean },
    showMoreVisible: { type: Boolean }
  };

  static styles = css`
    :host {
      /* display: block; */
      font-family: Arial, sans-serif;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      margin: 0;
      /* min-height: 500vh; */
      background-color: #f0f0f0;
      /* border-radius: 8px; */
      /* box-shadow: 0 2px 4px rgba(0,0,0,0.1); */
/* tambahan baru dari ddd-theme-simple */

      border-radius: var(--ddd-radius-xs);
          --component-color: var(
            --lowContrast-override,
            var(
              --ddd-theme-accent,
              var(--ddd-theme-bgContrast, var(--ddd-theme-default-white))
            )
          );
          --component-background-color: var(
            --ddd-theme-primary,
            var(--simple-colors-default-theme-green-7)
          );
          --component-border-color: var(--component-color);
    }
    .content {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.7s ease-out;
    }
    .content.visible {
      max-height: 500px; /* Adjust this value based on your content */
    }
    .button-container {
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
    }
    button {
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      font-size: 16px;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    button:hover {
      transform: translateY(-2px);
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }
    .pause {
      background-color: var(--component-background-color, transparent);
      font-weight: var(--ddd-font-weight-black);
      color: white;
      animation: shake 0.82s cubic-bezier(.36,.07,.19,.97) both infinite;
      transform: translate3d(0, 0, 0);
      backface-visibility: hidden;
      perspective: 1000px;
    }
    @keyframes shake {
      10%, 90% { transform: translate3d(-1px, 0, 0); }
      20%, 80% { transform: translate3d(2px, 0, 0); }
      30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
      40%, 60% { transform: translate3d(4px, 0, 0); }
    }
    .arrow-down {
      width: 0; 
      height: 0; 
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
      border-top: 10px solid #008CBA;
      cursor: pointer;
      margin-left: 10px;
    }
    .show-more {
      display: none;
      background-color: #4CAF50;
      color: white;
      margin-top: 10px;
    }
    .show-more.visible {
      display: block;
    }
  `;

  constructor() {
    super();
    this.visibleContent = 1;
    this.showButtons = true;
    this.showMoreVisible = false;
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
        <button class="pause" @click=${this.pause}>Tampilkan</button>
        <div class="arrow-down" @click=${this.toggleShowMore}></div>
      </div>
      <button class="show-more ${this.showMoreVisible ? 'visible' : ''}" @click=${this.showMore}>Tampilkan Semua</button>
    `;
  }

  toggleShowMore() {
    this.showMoreVisible = !this.showMoreVisible;
  }

  showMore() {
    this.visibleContent = 4;
    this.showButtons = false;
  }

  pause() {
    if (this.visibleContent < 3) {
      this.visibleContent++;
    } else {
      this.visibleContent = 4;
      this.showButtons = false;
    }
  }
}

customElements.define('animated-pause-component', AnimatedPauseComponent);