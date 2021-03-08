import {valueBinder} from "../packages/binders.js";

let system = new hd.ConstraintSystem();

let names = [
    "Emil, Hans",
    "Mustermann, Max",
    "Tich, Roman"
]

export function changeValueBinder(element, value) {
    element.addEventListener('change', () => {
        value.value.set(element.value);
    });
}


window.onload = () => {
    let nameElement = document.getElementById('name');
    let surnameElement = document.getElementById('surname');

    let component = hd.component`
        var changing = ", ", name, surname;
        
        constraint {
            (changing -> name) => changing.split(', ')[0];
        }
        constraint {
            (changing -> surname) => changing.split(', ')[1];
        }
    `;
    /**
     * Prøve ut (changing -> name, surname) { return ["", ""]; }
     */

    system.addComponent(component);
    system.update();

    changeValueBinder(document.getElementById('list'), component.vs.changing);
    valueBinder(nameElement, component.vs.name);
    valueBinder(surnameElement, component.vs.surname);
    createNames();

    document.getElementById('create').addEventListener('click', () => {
        addName(nameElement.value + ", " + surnameElement.value)
    })

    document.getElementById('delete').addEventListener('click', () => {
        removeName(nameElement.value + ", " + surnameElement.value)
    })
}

function createNames() {
    for (const name of names) {
        let node = document.createElement('option');
        node.innerText = name;
        document.getElementById('list').appendChild(node);
    }
}

function addName(name) {
    let node = document.createElement('option');
    node.innerText = name;
    document.getElementById('list').appendChild(node);
}

function removeName(s) {
    document.getElementById('list').childNodes.forEach((value => {
        if (value.value === s) {
            document.getElementById('list').removeChild(value);
        }
    }));
}
