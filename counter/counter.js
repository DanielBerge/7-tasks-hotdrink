let countElement = document.getElementById('count');
let buttonElement = document.getElementById('button');
let count = 0;

window.onload = () => {
    buttonElement.addEventListener('click', () => {
        countElement.innerText = (++count).toString()
    });
}

