import './style/style.scss';

// All kod härifrån och ner är bara ett exempel för att komma igång

console.log('hello world')

const nameInput = document.querySelector('#name');

const username = localStorage.getItem('username') || '';

nameInput.value = username;

nameInput.addEventListener('change', e => {
  localStorage.setItem('username', e.target.value);
});