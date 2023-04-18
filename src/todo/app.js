import todoStore, { Filters } from '../store/todo.store';
import html from './app.html?raw';
import { renderTodos } from './use-cases';
import { renderPending } from './use-cases';

const ElementIDs = {
    todoList: '.todo-list',
    newTodoInput: '#new-todo-input',
    clearCompleted: '.clear-completed',
    todoFilters: '.filtro',
    pendingCountLabel: '#pending-count'
}

/**
 * 
 * @param {String} elementId 
 */
export const App = ( elementId ) => {
    const displayTodos = () => {
        const todos = todoStore.getTodos( todoStore.getCurrentFilter() );
        renderTodos(ElementIDs.todoList, todos);
        updatePendingCount();
    }

    const updatePendingCount = () => {
        renderPending(ElementIDs.pendingCountLabel);
    }

    (()=> {
        const app = document.createElement('div');
        app.innerHTML = html;
        document.querySelector(elementId).append(app);
        displayTodos();
    })();

    // HTML References
    const newDescriptionInput = document.querySelector(ElementIDs.newTodoInput);
    const todoListUl = document.querySelector(ElementIDs.todoList);
    const clearCompleted = document.querySelector(ElementIDs.clearCompleted);
    const filtersLIs = document.querySelectorAll(ElementIDs.todoFilters);

    //Listeners
    newDescriptionInput.addEventListener('keyup', (event) => {
        if (event.keyCode !== 13) return;
        if (event.target.value.trim().length === 0) return;

        todoStore.addTodo(event.target.value);
        displayTodos();
        event.target.value = '';
    });

    todoListUl.addEventListener('click', (event) => {
        const element = event.target.closest('[data-id]');
        todoStore.toggleTodo(element.getAttribute('data-id'));
        displayTodos();
    });

    todoListUl.addEventListener('click', (event) => {
        const element = event.target.closest('[data-id]');
        const isDestroyElement = event.target.className === 'destroy';
        if (!element || !isDestroyElement) return;
        
        todoStore.deleteTodo(element.getAttribute('data-id'));
        displayTodos();
    });

    clearCompleted.addEventListener('click', () => {
        todoStore.deleteCompleted();
        displayTodos();
    });

    filtersLIs.forEach(element => {
        element.addEventListener('click', (element) => {
            filtersLIs.forEach(el => el.classList.remove('selected'));
            element.target.classList.add('selected');

            switch (element.target.text) {
                case 'Todos':
                    todoStore.setFilter(Filters.All);
                    break;
                case 'Pendientes':
                    todoStore.setFilter(Filters.Pending);
                    break;
                case 'Completados':
                    todoStore.setFilter(Filters.Completed);
                    break;
            }
            displayTodos();
        });
    });
}