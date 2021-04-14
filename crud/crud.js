import {valueBinder} from "../packages/binders.js";

let system = new hd.ConstraintSystem();

let filterElement = document.getElementById('filter');
let listElement = document.getElementById('list');
let nameElement = document.getElementById('name');
let surnameElement = document.getElementById('surname');

window.onload = async () => {
    let component = hd.component`
        var names = ["Emil, Hans", "Mustermann, Max", "Tich, Roman"];
        var changing = ", ", name, surname, filtered = [], filter = "";
        
        constraint {
            (changing -> name, surname) => {
                let split = changing.split(', ');
                return [split[0], split[1]];
            }
            (name, surname -> changing) => {
                return name + ", " + surname;
            }
        }
        
        constraint {
            (filter, names -> filtered) => names.filter((value) => value.toLowerCase().includes(filter.toLowerCase()));
        }
    `;

    await system.addComponent(component);
    system.update();

    changeValueBinder(listElement, component.vs.changing);
    valueBinder(nameElement, component.vs.name);
    valueBinder(surnameElement, component.vs.surname);
    valueBinder(filterElement, component.vs.filter);
    listBinder(listElement, component.vs.filtered);

    document.getElementById('create').addEventListener('click', () => {
        if (nameElement.value !== "" && surnameElement.value !== "") {
            let copy = component.vs.names.value.value;
            copy.push(nameElement.value + ", " + surnameElement.value);
            component.vs.names.value.set(copy);
        }
    })

    document.getElementById('update').addEventListener('click', () => {
        let name = listElement.value;
        if (name !== "") {
            let copy = component.vs.names.value.value;
            copy[copy.indexOf(name)] = component.vs.changing.value.value;
            component.vs.names.value.set(copy);
        }
    })

    document.getElementById('delete').addEventListener('click', () => {
        let name = nameElement.value + ", " + surnameElement.value;
        let copy = component.vs.names.value.value;
        delete copy[copy.indexOf(name)];
        component.vs.names.value.set(copy);
    })
}
function changeValueBinder(element, value) {
    element.addEventListener('change', () => {
        value.value.set(element.value);
    });
}

function listBinder(element, value) {
    value.value.subscribe({
        next: val => {
            if (val.hasOwnProperty('value')) {
                while (element.hasChildNodes()) {
                    element.childNodes[0].remove();
                }
                for (const name of value.value.value) {
                    let node = document.createElement('option');
                    node.innerText = name;
                    element.appendChild(node);
                }
            }
        }
    });
}
