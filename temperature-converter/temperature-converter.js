import {valueBinder} from "../packages/binders.js";
import {comp} from "./comp.hd.js";

let system = new hd.ConstraintSystem();

window.onload = () => {
    system.addComponent(comp);
    system.update();

    valueBinder(document.getElementById("celcius"), comp.vs.celcius);
    valueBinder(document.getElementById("fahrenheit"), comp.vs.fahrenheit);
}