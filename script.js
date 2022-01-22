const todoForm = document.querySelector('#todoForm');
const todoInput = document.querySelector('#todoInput');
const output = document.querySelector('#output');
const wrapper = document.querySelector('#wrapper');

// LÄGG TILL ADDEVENTLISTENER  SUBMIT DEL SÅ ERROR FUNKAR



let todos = [];

const getTodos = async() => {
    const response = await fetch ('https://jsonplaceholder.typicode.com/todos/?_limit=10%27')
    const data = await response.json()
    todos = data;

    
    listTodos();
}

getTodos();

const listTodos = () => {
    wrapper.innerHTML = ''
    todos.forEach(todo => {
    wrapper.appendChild(createTodo(todo));

    })
}

const createTodo = todo => {

    let output = document.createElement('div');
    output.classList.add('output');

    let card = document.createElement('div');
    card.classList.add('todo');

    let square = document.createElement('label');
    square.classList.add('square');

    let checkbox = document.createElement('input');
    checkbox.classList.add('checkbox');
    checkbox.type = 'checkbox';

    let checkmark = document.createElement('div');
    checkmark.classList.add('checkmark');

    let title = document.createElement('h4');
    title.classList.add('todo-title');
    title.innerText = todo.title 

    let button = document.createElement('button');
    button.classList.add('btn', 'delete')
    button.innerText = 'X'

    
    output.appendChild(card);
    square.appendChild(checkbox);
    square.appendChild(checkmark);
    card.appendChild(square);
    card.appendChild(title);
    card.appendChild(button);

    if(todo.completed){
      card.classList.add('checked')
      checkbox.checked = true;
    }

    
    button.addEventListener('click', () => deleteTodo(todo.id, card))
    checkbox.addEventListener('click', () => {
        if(checkbox.checked === true){
            card.classList.add('checked'); 
            todo.completed = true
        }else if (checkbox.checked !== true){
            card.classList.remove('checked')
            todo.completed = false
        }
    })
    return output;
}

function deleteTodo(id, todo){
    todos = todos.filter(todo => todo.id !== id)
    fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
        method: 'DELETE',
    })

    listTodos();
}

const createNewTodo = title => {
    fetch('https://jsonplaceholder.typicode.com/todos/?_limit=10%27', {
        method: 'POST',
        body: JSON.stringify({
            title,
            completed: false,
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
    .then(response => response.json())

    .then(data => {
        todos.unshift(data);
        listTodos()
    })
}

todoForm.addEventListener('submit', e => {
    e.preventDefault();

    const parent = todoInput.parentElement.parentElement;

    if(todoInput.value.trim() === ''){
        parent.classList.add('error')
        document.querySelector('.invalid-input').innerText = 'You need to add something to do...';
        return false;
    }else if(todoInput.value.trim() !== ''){
        createNewTodo(todoInput.value);
        todoInput.value = '';
        todoInput.focus()
        parent.classList.remove('error')
    }
})