import {disabledBinder, valueBinder} from "../packages/binders.js";
import {comp} from "./comp.hd.js"

let system = new hd.ConstraintSystem();

window.onload = () => {
    system.addComponent(comp);
    system.update();

    valueBinder(document.getElementById("start"), comp.vs.startDate);
    valueBinder(document.getElementById("return"), comp.vs.returnDate);
    disabledBinder(document.getElementById("return"), comp.vs.returnDisabled);
    disabledBinder(document.getElementById("book"), comp.vs.bookDisabled);
    valueBinder(document.getElementById("flightType"), comp.vs.flightType);

    document.getElementById("book").addEventListener('click', () => {
        alert(`You have booked ${component.vs.flightType.value.value} flight on ${comp.vs.startDate.value.value} ${comp.vs.returnDate.value.value}`)
    })
}
