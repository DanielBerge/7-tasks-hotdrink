import {innerTextBinder} from "../packages/binders.js";

let countElement = document.getElementById('count');
let buttonElement = document.getElementById('button');

let system = new hd.ConstraintSystem();

window.onload = () => {
    let comp = hd.component`
        var count = 0;
    `;

    system.addComponent(comp);
    system.update();

    innerTextBinder(countElement, comp.vs.count);
    buttonElement.addEventListener('click', () => {
        system.scheduleCommand([comp.vs.count.value], [comp.vs.count.value], (count) => ++count );
    });
}
