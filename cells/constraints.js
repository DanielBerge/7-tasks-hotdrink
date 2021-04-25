import {innerTextBinder} from "../packages/binders.js";
import {Field} from "./parser.js";

let system = new hd.ConstraintSystem();

function chooseBinding(arg, variable) {
    if (arg.type === Field) {
        combiner(document.getElementById(arg.val), variable);
    } else {
        variable.value.set(arg.val)
    }
}

function sumBinder(element, value, index) {
    function updateValue() {
        system.scheduleCommand([value.value], [value.value], (list) => {
            list[index] = parseInt(element.innerText === "" ? "0" : element.innerText);
            return list;
        })
    }

    updateValue();
    element.addEventListener('change', () => {
        updateValue();
    });
    element.addEventListener('DOMSubtreeModified', () => {
        updateValue();
    });
}

function combiner(element, value) {
    value.value.set(element.innerText);
    element.addEventListener('change', () => {
        value.value.set(element.innerText);
    });
    element.addEventListener('DOMSubtreeModified', () => {
        value.value.set(element.innerText);
    });
}

export function addConstraint(arg1, arg2, td) {
    // language=textmate
    let component = hd.component`
           var sum, first, second;
           
           constraint {
               (first, second -> sum) => parseInt(first) + parseInt(second);
           }
       `;

    system.addComponent(component);
    system.update();
    chooseBinding(arg1, component.vs.first);
    chooseBinding(arg2, component.vs.second);
    innerTextBinder(td, component.vs.sum);
}

export function divConstraint(arg1, arg2, td) {
    // language=textmate
    let component = hd.component`
            var quotient, divisor, dividend;
            
            constraint {
                (dividend, divisor -> quotient) => dividend/divisor;
            }
        `;
    system.addComponent(component);
    system.update();
    chooseBinding(arg1, component.vs.dividend);
    chooseBinding(arg2, component.vs.divisor);
    innerTextBinder(td, component.vs.quotient);
}

export function multConstraint(arg1, arg2, td) {
    // language=textmate
    let component = hd.component`
           var sum, first, second;
           
           constraint {
               (first, second -> sum) => first * second;
           }
    `;
    system.addComponent(component);
    system.update();
    chooseBinding(arg1, component.vs.first);
    chooseBinding(arg2, component.vs.second);
    innerTextBinder(td, component.vs.sum);
}

export function bindConstraint(arg, td) {
    // language=textmate
    let component = hd.component`
            var val, binded;
            
            constraint {
                (binded -> val) => binded;
            }
        `;
    system.addComponent(component);
    system.update();
    innerTextBinder(td, component.vs.val);
    combiner(document.getElementById(arg), component.vs.binded);
}

export async function sumConstraint(arg1, arg2, td) {
    // language=textmate
    let component = hd.component`
           var sum, vals = [];
           
           constraint {
               (vals -> sum) => vals.reduce((next, curr) => next + curr);
           }
       `;
    await system.addComponent(component);
    await system.update();
    let valIndex = 0;
    for (let i = arg1.charCodeAt(0); i <= arg2.charCodeAt(0); i++) {
        for (let j = parseInt(arg1[1]); j <= parseInt(arg2[1]); j++) {
            let elem = document.getElementById(String.fromCharCode(i) + j);
            sumBinder(elem, component.vs.vals, valIndex++);
        }
    }

    innerTextBinder(td, component.vs.sum);
}
