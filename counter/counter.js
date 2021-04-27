import {innerTextBinder} from "../packages/binders.js";

let system = new hd.ConstraintSystem();

window.onload = () => {
    // language=textmate
    let comp = hd.component`
        var count = 0;
    `;

    system.addComponent(comp);
    system.update();

    innerTextBinder(document.getElementById('count'), comp.vs.count);

    document.getElementById('button').addEventListener('click', () => {
        system.scheduleCommand([comp.vs.count.value], [comp.vs.count.value], (count) => ++count);
    });
}
