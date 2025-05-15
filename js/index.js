
const currentUser = {"id":11, "username":"Sami"};

function showcaseBook(book) {
    const showDiv = document.querySelector('#show-panel');
    const div = document.createElement('div');

    // div.style.textAlign = 'center';

    div.innerHTML = `
    <img style='width: 250px' src="${book.img_url}"/>
    <h1>${book.title}</h1>
    <h5>${book.subtitle}</h5>
    <h3>Written by: ${book.author}</h3>
    <p>${book.description}</p>
    `

    showDiv.appendChild(div)
}

// style='padding-left: 20px; padding-bottom: 10px;'

function showcaseUser(user) {
    const showDiv = document.querySelector('#show-panel');
    const div = document.createElement('div');
    const ul = document.createElement('ul');
    const btn = document.createElement('button');

    const alreadyLiked = user.users.some(yousr => yousr.id === currentUser.id);
    btn.innerText = alreadyLiked ? 'Dislike' : 'Like';

    user.users.forEach(usr => {
        const li = document.createElement('li');

        li.innerHTML = `${usr.username}`;

        ul.appendChild(li)
    })
    div.appendChild(ul);
    div.appendChild(btn);
    showDiv.appendChild(div);

    btn.addEventListener('click', () => {
        const alreadyLiked = user.users.some(yousr => yousr.id === currentUser.id);

        if(alreadyLiked) {
            const removeUserArr = user.users.filter((yousr) => yousr.id !== currentUser.id)

            fetch(`http://localhost:3000/books/${user.id}`, {
                'method': 'PATCH',
                'headers': {
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify({
                    users: removeUserArr
                })
            })
            .then((res) => res.json())
            .then((updatedUsers) => {
                user.users = updatedUsers.users;
                //becuase we are telling the fetch what to do by hardcoding the removeUserArr 
                // all we are doing here is rebuilding that updated users list. 
                ul.innerHTML = '';
                updatedUsers.users.forEach(user => {
                    const li = document.createElement('li');
                    li.innerText = user.username;
                    ul.appendChild(li);
                })
            })
            btn.innerText = 'like';
        } else {
            const newUserArr = [...user.users, currentUser];

            fetch(`http://localhost:3000/books/${user.id}`, {
                'method': 'PATCH',
                'headers': {
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify({
                    users: newUserArr
                })
            })
            .then((res) => res.json())
            .then((updatedUsers) => {
                user.users = updatedUsers.users;

                ul.innerHTML = '';

                updatedUsers.users.forEach((user) => {
                    const li = document.createElement('li');

                    li.innerText = user.username;

                    ul.appendChild(li);
                })
            }) 
            btn.innerText = 'Dislike';
        }          
    })
}



function holdSelection(book) {
    // const listDiv = document.querySelector('#list-panel');
    const ulList = document.querySelector('#list');
    const li = document.createElement('li');

    li.dataset.id = `${book.id}`;
    li.innerHTML = `${book.title}`;

    ulList.appendChild(li);

    li.addEventListener('click', () => {
        const div = document.querySelector('#show-panel');

        div.innerHTML = ''

        showcaseBook(book);
        showcaseUser(book);
    })
}

function fetchBooks() {
    fetch('http://localhost:3000/books')
    .then((res) => res.json())
    .then((books) => {
        books.forEach((book) => holdSelection(book))
    })
}

function init() {
    fetchBooks()
}

document.addEventListener("DOMContentLoaded", () => init());
