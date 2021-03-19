import {valueBinder} from "../packages/binders.js";

let system = new hd.ConstraintSystem();

let names = [
    "Emil, Hans",
    "Mustermann, Max",
    "Tich, Roman"
]

let filterElement = document.getElementById('filter');
let listElement = document.getElementById('list');
let nameElement = document.getElementById('name');
let surnameElement = document.getElementById('surname');

export function changeValueBinder(element, value) {
    element.addEventListener('change', () => {
        value.value.set(element.value);
    });
}

window.onload = () => {
    let component = hd.component`
        var changing = ", ", name, surname;
        
        constraint {
            (changing -> name, surname) => {
                let split = changing.split(', ');
                return [split[0], split[1]];
            }
            (name, surname -> changing) => {
                return name + ", " + surname;
            }
        }
    `;

    system.addComponent(component);
    system.update();

    changeValueBinder(document.getElementById('list'), component.vs.changing);
    valueBinder(nameElement, component.vs.name);
    valueBinder(surnameElement, component.vs.surname);
    syncList();

    document.getElementById('create').addEventListener('click', () => {
        if (nameElement.value !== "" && surnameElement.value !== "") {
            names.push(nameElement.value + ", " + surnameElement.value)
            syncList();
        }
    })

    document.getElementById('update').addEventListener('click', () => {
        let name = document.getElementById('list').value;
        if (name !== "") {
            delete names[names.indexOf(name)];
            names.push(component.vs.changing.value.value);
            syncList();
        }
    })

    document.getElementById('delete').addEventListener('click', () => {
        let name = nameElement.value + ", " + surnameElement.value;
        delete names[names.indexOf(name)];
        syncList();
    })

    filterElement.addEventListener('input', () => {
        syncList();
    })
}

function syncList() {
    while (listElement.hasChildNodes()) {
        listElement.childNodes[0].remove();
    }

    for (const name of names) {
        if (name?.includes(filterElement.value)) {
            let node = document.createElement('option');
            node.innerText = name;
            listElement.appendChild(node);
        }
    }
}