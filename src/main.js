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
[] När de passerat deadline ska något hända (annan färg eller text?)
[] Deadline inom 5 dagar ska visas med text/färg
*/

// Have been using a video from Tyler Potts for help to create this todo-app

let todos = JSON.parse(localStorage.getItem('todos')) || [];
const newTodoForm = document.querySelector('#new-todo-form');
const nameInput = document.querySelector('#name');
const username = localStorage.getItem('username') || '';

const todayDate = new Date();
let year = todayDate.getUTCFullYear();
let month = todayDate.getMonth() + 1;
let day = todayDate.getDate();

const sortSelect = document.querySelector('#sort');
const completedBtn = document.querySelector('#completed');
const activeBtn = document.querySelector('#active');
const allBtn = document.querySelector('#all');
const clearAllBtn = document.querySelector('#clear-all');
const todoList = document.querySelector('#todo-list');
const minDate = `${year}-${month}-${day}`;

window.addEventListener('load', () => {
  // Saves the users nameinput in localstorage and convert it to uppercase
  nameInput.value = username.toUpperCase();

  nameInput.addEventListener('change', (e) => {
    localStorage.setItem('username', `${e.target.value}!`);
  });

  newTodoForm.addEventListener('submit', addNewTodo);

  function addNewTodo(e) {
    e.preventDefault();

    const todo = {
      content: e.target.elements.content.value,
      dueDate: e.target.elements.dueDate.value,
      category: e.target.elements.category.value,
      done: false,
      createdAt: new Date().getTime(),
    };

    todos.push(todo);

    localStorage.setItem('todos', JSON.stringify(todos));

    e.target.reset();

    moveToEndOfArray();
    displayTodos(todos);
    countTodos(todos);
  }
  displayTodos(todos);
  countTodos(todos);
});

// To disable past dates in the calender
function disablePastDates() {
  document.getElementById('due-date-input').setAttribute('min', minDate);

  if (month < 10) {
    month = `0${month}`;
  }
  if (day < 10) {
    day = `0${day}`;
  }
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

// Prints out the users todos
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

    input.type = 'checkbox';
    input.checked = todo.done;

    if (todo.category === 'personal') {
      category.innerHTML = '<img src="public/icon-personal.png"/>';
    }
    if (todo.category === 'kids') {
      category.innerHTML = '<img src="public/icon-kids.png"/>';
    }
    if (todo.category === 'job') {
      category.innerHTML = '<img src="public/icon-job.png"/>';
    }
    if (todo.category === 'other') {
      category.innerHTML = '<img src="public/icon-other.png"/>';
    }

    content.classList.add('todo-content');
    dueDate.classList.add('duedate-div');
    category.classList.add('category-icon');
    actions.classList.add('actions');
    edit.classList.add('edit');
    deleteButton.classList.add('delete');

    const today = new Date();
    const dueDates = new Date(todo.dueDate);
    const dueIn5Days = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5);

    if (dueDates < today) {
      console.log('tiden är ute');
      dueDate.classList.add('deadline-passed');
    } else if (dueDates <= dueIn5Days) {
      console.log('5 dagar eller mindre kvar');
      dueDate.classList.add('deadline-soon');
    }

    dueDate.innerHTML = todo.dueDate;

    content.innerHTML = `<input type="text" value="${todo.content}" readonly>`;
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

    input.addEventListener('click', (e) => {
      todo.done = e.target.checked;
      moveToEndOfArray();
      displayTodos(todos);
      localStorage.setItem('todos', JSON.stringify(todos));

      if (todo.done) {
        todoItem.classList.add('done');
      } else {
        todoItem.classList.remove('done');
      }
    });

    function editTodo() {
      const todoInput = content.querySelector('input');
      todoInput.removeAttribute('readonly');
      todoInput.focus();
      todoInput.addEventListener('blur', (e) => {
        todoInput.setAttribute('readonly', true);
        todo.content = e.target.value;
        localStorage.setItem('todos', JSON.stringify(todos));
      });
    }

    edit.addEventListener('click', editTodo);

    function deleteTodo() {
      todos = todos.filter((t) => t !== todo);
      localStorage.setItem(('todos'), JSON.stringify(todos));
      displayTodos(todos);
      countTodos(todos);
    }

    deleteButton.addEventListener('click', deleteTodo);

    // Testar en annan Funktion för att kolla hur många dagar det är till duedate
  });
}

function showAllTodos() {
  displayTodos(todos);
  countTodos(todos);
}

function showActiveTodos() {
  const activeTodos = todos.filter((todo) => todo.done === false);
  displayTodos(activeTodos);
  countTodos(activeTodos);
}

function showCompletedTodos() {
  const completedTodos = todos.filter((todo) => todo.done === true);
  displayTodos(completedTodos);
  countTodos(completedTodos);
}

function countTodos(arr) {
  const todosLeft = document.querySelector('#items-left');
  const counterString = arr.length === 1 ? 'todo' : 'todos';
  todosLeft.innerHTML = `${arr.length} ${counterString}`;
}

function clearAllTodos() {
  todos = [];
  localStorage.setItem(('todos'), JSON.stringify(todos));
  displayTodos(todos);
  countTodos(todos);
}

sortSelect.addEventListener('change', sortTodos);
completedBtn.addEventListener('click', showCompletedTodos);
activeBtn.addEventListener('click', showActiveTodos);
allBtn.addEventListener('click', showAllTodos);
clearAllBtn.addEventListener('click', clearAllTodos);

disablePastDates();

console.table(todos);
