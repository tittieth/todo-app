import './style/style.scss';

/*
[X] Användaren ska kunna skriva in sitt namn som sparas i localstorage
[X] Ska kunna lägga till todos och välja kategori och datum
[X] Ska kunna ta bort todos
[X] Ska kunna redigera todos
[X] Ska kunna markera en todo som klar och då läggs den till i en lista med klara
[X] Ska kunna välja att visa alla todos, bara de som är klara eller bara de som är aktiva
[X] Ska kunna sorteras efter slutdatum
[X] Kunna sorteras på datum när de las till
[X] Klara todos ska lägga sig sist i listan
[X] När de passerat deadline ska något hända (annan färg eller text?)
[X] Deadline inom 5 dagar ska visas med text/färg
*/

// Have been using a video from Tyler Potts for help to create this todo-app
// https://www.youtube.com/watch?v=6eFwtaZf6zc

/** *****************************************************************************
 * -------------------Variables--------------------------
 ******************************************************************************** */

let todos = JSON.parse(localStorage.getItem('todos')) || [];
const newTodoForm = document.querySelector('#new-todo-form');
const nameInput = document.querySelector('#name');
const username = localStorage.getItem('username') || '';
const dueDateCheck = document.querySelector('#due-date-input');
const checkTodoInput = document.querySelector('#content');
const errorMsg = document.querySelector('#error-msg');

const todayDate = new Date();
const year = todayDate.getUTCFullYear();
const month = todayDate.getMonth() + 1;
const day = todayDate.getDate();

const sortSelect = document.querySelector('#sort');
const completedBtn = document.querySelector('#completed');
const activeBtn = document.querySelector('#active');
const allBtn = document.querySelector('#all');
const clearAllBtn = document.querySelector('#clear-all');
const todoList = document.querySelector('#todo-list');
const minDate = `${year}-${month}-${day}`;

/** *****************************************************************************
 * ----------------------------Functions----------------------------------------
 ******************************************************************************** */

// Saves the users nameinput in localstorage
nameInput.value = username;

nameInput.addEventListener('change', (e) => {
  localStorage.setItem('username', `${e.target.value}!`);
});

// To disable past dates in the calender
function disablePastDates() {
  document.querySelector('#due-date-input').setAttribute('min', minDate);
}

// count the todos
function countTodos(arr) {
  const todosLeft = document.querySelector('#items-left');
  const counterString = arr.length === 1 ? 'todo' : 'todos';
  todosLeft.innerHTML = `${arr.length} ${counterString}`;
}

// When a todo is checked it will move down on the list
function moveToEndOfArray() {
  todos.sort((todos1, todos2) => {
    if (todos1.done < todos2.done) {
      return -1;
    }
    if (todos1.done > todos2.done) {
      return 1;
    }
    return 0;
  });
}

// To save data to localstorage
function saveData() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

// Prints out the todos
function displayTodos(arr) {
  todoList.innerHTML = '';

  arr.forEach((todo) => {
    const todoItem = document.createElement('div');
    todoItem.classList.add('todo-item');

    const label = document.createElement('label');
    const input = document.createElement('input');
    const content = document.createElement('div');
    const dueDate = document.createElement('div');
    const category = document.createElement('div');
    const actions = document.createElement('div');
    const edit = document.createElement('button');
    const deleteButton = document.createElement('button');

    label.setAttribute('aria-label', 'check when done');

    input.type = 'checkbox';
    input.checked = todo.done;

    if (todo.category === 'personal') {
      category.classList.add('category-personal');
    }
    if (todo.category === 'kids') {
      category.classList.add('category-kids');
    }
    if (todo.category === 'job') {
      category.classList.add('category-job');
    }
    if (todo.category === 'other') {
      category.classList.add('category-other');
    }

    content.classList.add('todo-content');
    dueDate.classList.add('duedate-div');
    category.classList.add('category-icon');
    actions.classList.add('actions');
    edit.classList.add('edit');
    deleteButton.classList.add('delete');

    const dueDates = new Date(todo.dueDate);
    // eslint-disable-next-line max-len
    const dueIn5Days = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate() + 5);

    if (dueDates < todayDate) {
      todoItem.classList.add('deadline-passed');
    } else if (dueDates <= dueIn5Days) {
      todoItem.classList.add('deadline-soon');
    }

    dueDate.innerHTML = todo.dueDate;
    content.innerHTML = `<input type="text" value="${todo.content}" maxlength="25" aria-label="Your todo" readonly>`;
    edit.innerHTML = 'Edit';
    deleteButton.innerHTML = 'Delete';

    label.appendChild(input);
    todoItem.appendChild(label);
    todoItem.appendChild(content);
    todoItem.appendChild(dueDate);
    todoItem.appendChild(category);
    todoItem.appendChild(actions);
    actions.appendChild(edit);
    actions.appendChild(deleteButton);
    todoList.appendChild(todoItem);

    if (todo.done) {
      todoItem.classList.add('done');
      todoItem.classList.remove('deadline-soon');
      todoItem.classList.remove('deadline-passed');
    }

    input.addEventListener('click', (e) => {
      todo.done = e.target.checked;

      if (todo.done) {
        todoItem.classList.add('done');
      } else {
        todoItem.classList.remove('done');
      }

      moveToEndOfArray();
      displayTodos(todos);
      saveData();
    });

    const todoInput = content.querySelector('input');

    function editTodo() {
      todoInput.removeAttribute('readonly');
      todoInput.focus();
    }

    function saveEditedTodo(e) {
      todoInput.setAttribute('readonly', true);
      todo.content = e.target.value;
      saveData();
    }

    edit.addEventListener('click', editTodo);
    todoInput.addEventListener('blur', saveEditedTodo);

    function deleteTodo() {
      todos = todos.filter((t) => t !== todo);
      saveData();
      displayTodos(todos);
      countTodos(todos);
    }

    deleteButton.addEventListener('click', deleteTodo);
  });
}

// Add new todos
function addNewTodo(e) {
  e.preventDefault();

  const todo = {
    content: e.target.elements.content.value,
    dueDate: e.target.elements.dueDate.value,
    category: e.target.elements.category.value,
    done: false,
    createdAt: new Date().getTime(),
  };

  const getSelectedValue = document.querySelector('input[name="category"]:checked');

  if (getSelectedValue === null || dueDateCheck.value === '' || checkTodoInput.value === 0) {
    errorMsg.removeAttribute('hidden', '');
    errorMsg.innerHTML = 'Add todo, category and due date!';
    return;
  }

  todos.push(todo);

  saveData();

  e.target.reset();
  errorMsg.setAttribute('hidden', '');

  displayTodos(todos);
  countTodos(todos);
}
displayTodos(todos);
countTodos(todos);

/** *****************************************************************************
 * -------------------Functions for sorting the todos---------------------------
 ******************************************************************************** */

// To sort by duedate
function sortByDueDate() {
  todos.sort((todos1, todos2) => {
    if (todos1.dueDate < todos2.dueDate) {
      return -1;
    }
    if (todos1.dueDate > todos2.dueDate) {
      return 1;
    }
    return 0;
  });
}

// To sort by the date it was created
function sortByDate() {
  todos.sort((todos1, todos2) => {
    if (todos1.createdAt < todos2.createdAt) {
      return -1;
    }
    if (todos1.createdAt > todos2.createdAt) {
      return 1;
    }
    return 0;
  });
}

// To sort by name
function sortByName() {
  todos.sort((todos1, todos2) => {
    if (todos1.content.toLowerCase() < todos2.content.toLowerCase()) {
      return -1;
    }
    if (todos1.content.toLowerCase() > todos2.content.toLowerCase()) {
      return 1;
    }
    return 0;
  });
}

// To sort by category
function sortByCategory() {
  todos.sort((todos1, todos2) => {
    if (todos1.category < todos2.category) {
      return -1;
    }
    if (todos1.category > todos2.category) {
      return 1;
    }
    return 0;
  });
}

// To sort the todos
function sortTodos() {
  const sortValue = sortSelect.value;

  if (sortValue === 'name') {
    sortByName();
  } else if (sortValue === 'added-date') {
    sortByDate();
  } else if (sortValue === 'due-date') {
    sortByDueDate();
  } else if (sortValue === 'category') {
    sortByCategory();
  }
  displayTodos(todos);
}

/** ********************************************************
 * -------------------sorting end---------------------------
 ************************************************************ */

// Display all todos
function showAllTodos() {
  displayTodos(todos);
  countTodos(todos);
}

// Display active todos
function showActiveTodos() {
  const activeTodos = todos.filter((todo) => todo.done === false);

  displayTodos(activeTodos);
  countTodos(activeTodos);
}

// Display completed todos
function showCompletedTodos() {
  const completedTodos = todos.filter((todo) => todo.done === true);
  displayTodos(completedTodos);
  countTodos(completedTodos);
}

// To clear all the todos
function clearAllTodos() {
  todos = [];
  saveData();
  displayTodos(todos);
  countTodos(todos);
}

newTodoForm.addEventListener('submit', addNewTodo);
sortSelect.addEventListener('change', sortTodos);
completedBtn.addEventListener('click', showCompletedTodos);
activeBtn.addEventListener('click', showActiveTodos);
allBtn.addEventListener('click', showAllTodos);
clearAllBtn.addEventListener('click', clearAllTodos);

disablePastDates();
