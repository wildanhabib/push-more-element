import { LitElement, html, css } from 'lit';

class MicrosoftTodoClone extends LitElement {
    static properties = {
        todos: { type: Array },
        activeTab: { type: String },
    };

    static styles = css`
        :host {
            display: block;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f0f0f0;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }
        .header h1 {
            margin: 0;
            color: #0078d4;
        }
        .tabs {
            display: flex;
            margin-bottom: 20px;
        }
        .tab {
            padding: 10px 20px;
            background-color: #e0e0e0;
            border: none;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        .tab.active {
            background-color: #0078d4;
            color: white;
        }
        .todo-list {
            background-color: white;
            border-radius: 8px;
            padding: 20px;
        }
        .todo-item {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            padding: 10px;
            background-color: #f9f9f9;
            border-radius: 4px;
        }
        .todo-item input[type="checkbox"] {
            margin-right: 10px;
        }
        .todo-item .text {
            flex-grow: 1;
        }
        .todo-item .actions {
            display: flex;
            gap: 10px;
        }
        .todo-item button {
            background: none;
            border: none;
            cursor: pointer;
            font-size: 18px;
        }
        .add-todo {
            display: flex;
            margin-top: 20px;
        }
        .add-todo input {
            flex-grow: 1;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 4px 0 0 4px;
        }
        .add-todo button {
            padding: 10px 20px;
            background-color: #0078d4;
            color: white;
            border: none;
            border-radius: 0 4px 4px 0;
            cursor: pointer;
        }
    `;

    constructor() {
        super();
        this.todos = [];
        this.activeTab = 'my-day';
        this.fetchTodos();
    }

    render() {
        return html`
            <div class="header">
                <h1>To Do</h1>
            </div>
            <div class="tabs">
                <button class="tab ${this.activeTab === 'my-day' ? 'active' : ''}" @click="${() => this.setActiveTab('my-day')}">My Day</button>
                <button class="tab ${this.activeTab === 'important' ? 'active' : ''}" @click="${() => this.setActiveTab('important')}">Important</button>
                <button class="tab ${this.activeTab === 'planned' ? 'active' : ''}" @click="${() => this.setActiveTab('planned')}">Planned</button>
            </div>
            <div class="todo-list">
                ${this.filteredTodos.map((todo, index) => html`
                    <div class="todo-item">
                        <input type="checkbox" ?checked="${todo.completed}" @change="${() => this.toggleTodo(todo.id)}">
                        <span class="text">${todo.text}</span>
                        <div class="actions">
                            <button @click="${() => this.toggleImportant(todo.id)}">
                                ${todo.important ? '⭐' : '☆'}
                            </button>
                            <button @click="${() => this.removeTodo(todo.id)}">🗑️</button>
                        </div>
                    </div>
                `)}
            </div>
            <div class="add-todo">
                <input type="text" id="newTodo" placeholder="Add a task" @keyup="${this._handleKeyUp}">
                <button @click="${this._addTodo}">Add</button>
            </div>
        `;
    }

    get filteredTodos() {
        switch (this.activeTab) {
            case 'my-day':
                return this.todos.filter(todo => todo.myDay);
            case 'important':
                return this.todos.filter(todo => todo.important);
            case 'planned':
                return this.todos.filter(todo => todo.planned);
            default:
                return this.todos;
        }
    }

    setActiveTab(tab) {
        this.activeTab = tab;
    }

    async fetchTodos() {
        try {
            const response = await fetch('https://picturesque-torch-open.glitch.me/data');
            this.todos = await response.json();
        } catch (error) {
            console.error('Error fetching todos:', error);
        }
    }

    async _addTodo() {
        const input = this.shadowRoot.getElementById('newTodo');
        const todoText = input.value.trim();
        if (todoText) {
            const newTodo = {
                text: todoText,
                completed: false,
                important: false,
                myDay: this.activeTab === 'my-day',
                planned: this.activeTab === 'planned'
            };

            try {
                const response = await fetch('https://picturesque-torch-open.glitch.me/data', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newTodo),
                });
                const addedTodo = await response.json();
                this.todos = [...this.todos, addedTodo];
                input.value = '';
            } catch (error) {
                console.error('Error adding todo:', error);
            }
        }
    }

    _handleKeyUp(e) {
        if (e.key === 'Enter') {
            this._addTodo();
        }
    }

    async toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            const updatedTodo = { ...todo, completed: !todo.completed };
            try {
                await fetch(`https://picturesque-torch-open.glitch.me/data/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedTodo),
                });
                this.todos = this.todos.map(t => t.id === id ? updatedTodo : t);
            } catch (error) {
                console.error('Error updating todo:', error);
            }
        }
    }

    async toggleImportant(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            const updatedTodo = { ...todo, important: !todo.important };
            try {
                await fetch(`https://picturesque-torch-open.glitch.me/data/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedTodo),
                });
                this.todos = this.todos.map(t => t.id === id ? updatedTodo : t);
            } catch (error) {
                console.error('Error updating todo:', error);
            }
        }
    }

    async removeTodo(id) {
        try {
            // await fetch(`https://picturesque-torch-open.glitch.me/data/${id}`, {
            await fetch(`https://picturesque-torch-open.glitch.me/data/${id}`, {
                method: 'DELETE',
            });
            this.todos = this.todos.filter(t => t.id !== id);
        } catch (error) {
            console.error('Error removing todo:', error);
        }
    }
}

customElements.define('microsoft-todo-clone', MicrosoftTodoClone);