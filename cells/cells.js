import {evaluate, Field, lex, parse} from "./parser.js";
import {bindConstraint} from "./constraints.js";

const COLUMNS = 26;
const ROWS = 100;

export function textBinder(element, value) {
    value.value.subscribe({
        next: val => {
            if (val.hasOwnProperty('value')) {
                element.innerText = val.value;
            }
        }
    })
}

export function combiner(element, value) {
    value.value.set(element.innerText);
    element.addEventListener('change', () => {
        value.value.set(element.innerText);
    });
    element.addEventListener('DOMSubtreeModified', () => {
        value.value.set(element.innerText);
    });
}

function createColums() {
    for (let i = -1; i < COLUMNS; i++) {
        let td = document.createElement('td');
        if (i >= 0) {
            td.innerText = String.fromCharCode(i + 65);
        }
        document.getElementById('thead').appendChild(td);
    }
}

function createCells() {
    for (let i = 0; i < ROWS; i++) {
        let tr = document.createElement('tr');
        tr.innerText = i.toString();
        for (let j = 0; j < COLUMNS; j++) {
            let input = document.createElement('input');
            input.className = "inputField";
            let td = document.createElement('td');
            td.id = String.fromCharCode(j + 65) + i;
            input.type = "hidden";

            //Parse input when changed
            input.addEventListener('change', () => {
                if (input.value[0] === "=") {
                    let ast = parse(lex(input.value.slice(1)));
                    if (ast.type === Field) {
                        bindConstraint(ast.val, td);
                    } else {
                        evaluate(ast, td);
                    }
                } else
                    td.innerText = input.value;
                input.type = "hidden";
                td.appendChild(input);
            })


            //Show input field on click
            td.addEventListener('click', () => {
                let inputs = document.getElementsByClassName('inputField');
                for (let input1 of inputs) {
                    input1.type = "hidden";
                }
                input.type = "text";
            })

            td.appendChild(input);
            tr.appendChild(td);
        }
        document.getElementById('tbody').appendChild(tr);
    }
}

window.onload = () => {
    createColums();
    createCells();
}