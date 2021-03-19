import {combiner} from "./cells.js";
import {innerTextBinder} from "../packages/binders.js";

let system = new hd.ConstraintSystem();

function chooseBinding(arg, variable) {
    Number.isInteger(arg) ? variable.value.set(arg) : combiner(document.getElementById(arg), variable);
}

export function addConstraint(arg1, arg2, td) {
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
    textBinder(td, component.vs.quotient);
}

export function multConstraint(arg1, arg2, td) {
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
    textBinder(td, component.vs.sum);
}

export function bindConstraint(arg, td) {
    let component = hd.component`
            var val, binded;
            
            constraint {
                (binded -> val) => binded;
            }
        `;
    system.addComponent(component);
    system.update();
    textBinder(td, component.vs.val);
    combiner(document.getElementById(arg), component.vs.binded);
}
