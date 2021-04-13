import {valueBinder} from "../packages/binders.js";

let system = new hd.ConstraintSystem();

window.onload = () => {
    let component = hd.component`
     var celcius, fahrenheit;
     constraint {
       (celcius -> fahrenheit) => celcius * (9/5) + 32;
       (fahrenheit -> celcius) => (fahrenheit - 32) * (5/9);
     }
     `;

    system.addComponent(component);
    system.update();

    valueBinder(document.getElementById("celcius"), component.vs.celcius);
    valueBinder(document.getElementById("fahrenheit"), component.vs.fahrenheit);
}