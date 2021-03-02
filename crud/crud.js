import {valueBinder} from "../packages/binders.js";

let system = new hd.ConstraintSystem();

let names = [
    "Emil, Hans",
    "Mustermann, Max",
    "Tich, Roman"
]

export function changeValueBinder(element, value) {
    value.value.subscribe({
        next: val => {
            if (val.hasOwnProperty('value')) {
                console.log(val.value);
                let node = document.createElement('option');
                node.innerText = val.value;
                document.getElementById('list').replaceChild(element.children.item(1), node);
            }
        }
    });
    element.addEventListener('change', () => {
        value.value.set(element.value);
    });
}

window.onload = () => {
    let component = hd.component`
        var changing, name, surname;
        
        constraint {
            (changing -> name) => changing.split(', ')[0];
            (name -> changing) => name + changing.split(', ')[1];
        }
        constraint {
            (changing -> surname) => changing.split(', ')[1];
            (surname -> changing) => surname + changing.split(', ')[0];
        }
    `;

    system.addComponent(component);
    system.update();

    changeValueBinder(document.getElementById('list'), component.vs.changing);
    valueBinder(document.getElementById('name'), component.vs.name);
    valueBinder(document.getElementById('surname'), component.vs.surname);
    createNames();
}

function createNames() {
    for (const name of names) {
        let node = document.createElement('option');
        node.innerText = name;
        document.getElementById('list').appendChild(node);

    }
}