import {valueBinder} from "../packages/binders.js";
import {comp} from "./comp.hd.js"

let system = new hd.ConstraintSystem();

let filterElement = document.getElementById('filter');
let listElement = document.getElementById('list');
let nameElement = document.getElementById('name');
let surnameElement = document.getElementById('surname');

window.onload = async () => {

    await system.addComponent(comp);
    system.update();

    changeValueBinder(listElement, comp.vs.changing);
    valueBinder(nameElement, comp.vs.name);
    valueBinder(surnameElement, comp.vs.surname);
    valueBinder(filterElement, comp.vs.filter);
    listBinder(listElement, comp.vs.filtered);

    document.getElementById('create').addEventListener('click', () => {
        if (nameElement.value !== "" && surnameElement.value !== "") {
            let copy = comp.vs.names.value.value;
            copy.push(nameElement.value + ", " + surnameElement.value);
            comp.vs.names.value.set(copy);
        }
    })

    document.getElementById('update').addEventListener('click', () => {
        let name = listElement.value;
        if (name !== "") {
            let copy = comp.vs.names.value.value;
            copy[copy.indexOf(name)] = comp.vs.changing.value.value;
            comp.vs.names.value.set(copy);
        }
    })

    document.getElementById('delete').addEventListener('click', () => {
        let name = nameElement.value + ", " + surnameElement.value;
        let copy = comp.vs.names.value.value;
        delete copy[copy.indexOf(name)];
        comp.vs.names.value.set(copy);
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
