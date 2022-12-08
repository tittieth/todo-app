import './style/style.scss';

/*
[X] Användaren ska kunna skriva in sitt namn som sparas i localstorage
[] Ska kunna lägga till todos och välja kategori och datum
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

let todos = JSON.parse(localStorage.getItem('todos')) || [];
const newTodoForm = document.querySelector('#new-todo-form');
const nameInput = document.querySelector('#name');
const username = localStorage.getItem('username') || '';

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

  todos.push(todo);

  localStorage.setItem('todos', JSON.stringify(todos));

  e.target.reset();
})