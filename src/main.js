import './style/style.scss';

/*
[X] Användaren ska kunna skriva in sitt namn som sparas i localstorage
[X] Ska kunna lägga till todos och välja kategori och datum
[X] Ska kunna ta bort todos 
[X] Ska kunna redigera todos 
[X] Ska kunna markera en todo som klar och då läggs den till i en lista med klara 
[] Ska kunna välja att visa alla todos, bara de som är klara eller bara de som är aktiva
[] Ska kunna sorteras efter slutdatum 
[] Kunna sorteras på datum när de las till
[] Klara todos ska lägga sig sist i listan
[] När de passerat deadline ska något hända (annan färg eller text?)
[] Deadline inom 5 dagar ska visas med text/färg 
*/

// Have been using a video from Tyler Potts for help to create this todo-app

let todos = JSON.parse(localStorage.getItem('todos')) || [];
const newTodoForm = document.querySelector('#new-todo-form');
const nameInput = document.querySelector('#name');
const username = localStorage.getItem('username') || '';
const completedTodos = todos.filter(todo => todo.done == true);

window.addEventListener('load', () => {
  // Saves the users nameinput in localstorage and convert it to uppercase
  nameInput.value = username.toUpperCase();

  nameInput.addEventListener('change', e => {
    localStorage.setItem('username', e.target.value + '!');
  })

  // To get the values from the inputfields
  newTodoForm.addEventListener('submit', addNewTodo);

  function addNewTodo(e) {
    e.preventDefault();

    const todo = {
      content: e.target.elements.content.value,
      dueDate: e.target.elements.dueDate.value,
      category: e.target.elements.category.value,
      done: false,
      createdAt: new Date().getTime()
    }

    todos.push(todo);

    localStorage.setItem('todos', JSON.stringify(todos));

    e.target.reset();

    DisplayTodos(todos);
    countTodos(todos);
  }
  DisplayTodos(todos);
  countTodos(todos);
})

// To sort by duedate
function sortByDueDate() {
  todos.sort((todos1, todos2) => {
    return todos1.dueDate > todos2.dueDate;
  });
}

// To sort by the date it was created
function sortByDate() {
  todos.sort((todos1, todos2) => {
    return todos1.createdAt > todos2.createdAt;
  });
}

// To sort by name
function sortByName() {
  todos.sort((todos1, todos2) => {
    return todos1.content > todos2.content;
  });
}

const completedBtn = document.querySelector('#completed');
completedBtn.addEventListener('click', showCompletedTodos);

const todoList = document.querySelector('#todo-list');

// Prints out the users todos
function DisplayTodos(arr) {
  todoList.innerHTML = '';

  arr.forEach(todo => {
    const todoItem = document.createElement('div');
    todoItem.classList.add('todo-item')

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

    if (todo.category == 'personal') {
      category.innerHTML = '<img src="public/icon-personal.png"/>';
    }
    if (todo.category == 'kids') {
      category.innerHTML = '<img src="public/icon-kids.png"/>';
    }
    if (todo.category == 'job') {
      category.innerHTML = '<img src="public/icon-job.png"/>';
    } 
    if (todo.category == 'other') {
      category.innerHTML = '<img src="public/icon-other.png"/>';
    };

    content.classList.add('todo-content');
    dueDate.classList.add('duedate-div');
    category.classList.add('category-icon');
    actions.classList.add('actions');
    edit.classList.add('edit');
    deleteButton.classList.add('delete');

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

    if (todo.done) {
      todoItem.classList.add('done');
    }

    input.addEventListener('click', (e) => {
      todo.done = e.target.checked;
      localStorage.setItem('arr', JSON.stringify(arr));

      if (todo.done) {
        todoItem.classList.add('done');
      } else {
        todoItem.classList.remove('done');
      }
      DisplayTodos(todos);
      countTodos(todos);
    })

    edit.addEventListener('click', editTodo); 

    function editTodo (e) {
      const input = content.querySelector('input');
      input.removeAttribute('readonly');
      input.focus();
      input.addEventListener('blur', e => {
        input.setAttribute('readonly', true);
        todo.content = e.target.value;
        localStorage.setItem('arr', JSON.stringify(arr));
        DisplayTodos(todos);
      })
    }

    deleteButton.addEventListener('click', deleteTodo);

    function deleteTodo (e) {
      arr = arr.filter(t => t != todo);
      localStorage.setItem('arr', JSON.stringify(arr));
      DisplayTodos(todos);
      countTodos(todos);
    }
  })
}

function showCompletedTodos() {
  const completedTodos = todos.filter(todo => todo.done == true);
  DisplayTodos(completedTodos);
  countTodos(completedTodos);
}

function countTodos(arr) {
  const todosLeft = document.querySelector('#items-left');
  const counterString = arr.length === 1 ? 'todo' : 'todos';
  todosLeft.innerHTML = `${arr.length} ${counterString}`;
}

countTodos(todos);

console.table(completedTodos);
console.table(todos);
