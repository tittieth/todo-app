import './style/style.scss';

/*
[X] Användaren ska kunna skriva in sitt namn som sparas i localstorage
[X] Ska kunna lägga till todos och välja kategori och datum
[] Ska kunna ta bort todos 
[] Ska kunna redigera todos 
[] Ska kunna markera en todo som klar och då läggs den till i en lista med klara 
[] Ska kunna välja att visa alla todos, bara de som är klara eller bara de som är aktiva
[] Ska kunna sorteras efter slutdatum 
[] Kunna sorteras på datum när de las till
[] Nya todos ska lägga sig sist i listan
[] När de passerat deadline ska något hända (annan färg eller text?)
[] Deadline inom 5 dagar ska visas med text/färg 
*/

// Har utgått från en video av Tyler Potts och ändrat och lagt till lite saker.

let newTodos = JSON.parse(localStorage.getItem('newTodos')) || [];
let activeTodos = JSON.parse(localStorage.getItem('activeTodos')) || [];
let completedTodos = JSON.parse(localStorage.getItem('completedTodos')) || [];
const newTodoForm = document.querySelector('#new-todo-form');
  const nameInput = document.querySelector('#name');
  const username = localStorage.getItem('username') || '';

window.addEventListener('load', () => {
  // För att spara användarens namn
  nameInput.value = username;

  nameInput.addEventListener('change', e => {
    localStorage.setItem('username', e.target.value);
  })

  // Tar användarens inputs och lägger in det i listan todos 
  newTodoForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const todo = {
      content: e.target.elements.content.value,
      dueDate: e.target.elements.dueDate.value,
      category: e.target.elements.category.value,
      done: false,
      createdAt: new Date().getTime()
    }

    newTodos.push(todo);

    localStorage.setItem('newTodos', JSON.stringify(newTodos));

    e.target.reset();

    DisplayTodos();
  });
  DisplayTodos();
})

// Funktion för att skriva ut användarens todo
function DisplayTodos() {
  const todoList = document.querySelector('#todo-list');

  todoList.innerHTML = '';

  newTodos.forEach(todo => {
    const todoItem = document.createElement('div');
    todoItem.classList.add('todo-item')

    const label = document.createElement('label');
    const input = document.createElement('input');
    const span = document.createElement('span');
    const content = document.createElement('div');
    const dueDate = document.createElement('div');
    const category = document.createElement('span');
    const actions = document.createElement('div');
    const edit = document.createElement('button');
    const deleteButton = document.createElement('button');

    input.type = 'checkbox';
    input.checked = todo.done; 
    span.classList.add('bubble');

    if (todo.category == 'personal') {
      span.classList.add('personal');
    }
    if (todo.classList == 'kids') {
      span.classList.add('kids');
    }
    if (todo.classList == 'job') {
      span.classList.add('job');
    } else {
      span.classList.add('other');
    }

    content.classList.add('todo-content');
    dueDate.classList.add('dueDate-div');
    category.classList.add('category-icon');
    actions.classList.add('actions');
    edit.classList.add('edit');
    deleteButton.classList.add('delete');

    dueDate.innerHTML = todo.dueDate;
    content.innerHTML = `<input type="text" value="${todo.content}" readonly>`;
    edit.innerHTML = 'Edit';
    deleteButton.innerHTML = 'Delete';

    label.appendChild(input);
    label.appendChild(span);
    actions.appendChild(edit);
    actions.appendChild(deleteButton);
    todoItem.appendChild(label);
    todoItem.appendChild(content);
    todoItem.appendChild(actions);
    todoItem.appendChild(dueDate);

    todoList.appendChild(todoItem);

    if (todo.done) {
      todoItem.classList.add('done');
    }

    input.addEventListener('click', (e) => {
      todo.done = e.target.checked;
      localStorage.setItem('newTodos', JSON.stringify(newTodos));

      if (todo.done) {
        todoItem.classList.add('done');
      } else {
        todoItem.classList.remove('done');
      };

      DisplayTodos();
    })
  })
}

console.table(newTodos)