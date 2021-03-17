import {combiner, textBinder} from "./cells.js";

let system = new hd.ConstraintSystem();

export function addConstraint(arg1, arg2, td) {
    let component = hd.component`
           var sum, first, second;
           
           constraint {
               (first, second -> sum) => parseInt(first) + parseInt(second);
           }
       `;

    system.addComponent(component);
    system.update();
    if (Number.isInteger(arg1)) {
        component.vs.first.value.set(arg1);
    } else {
        combiner(document.getElementById(arg1), component.vs.first);
    }
    if (Number.isInteger(arg2)) {
        component.vs.second.value.set(arg2);
    } else {
        combiner(document.getElementById(arg2), component.vs.second);
    }
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
