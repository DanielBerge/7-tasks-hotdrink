import {innerTextBinder, maxBinder, valueBinder} from "../packages/binders.js";
import {comp} from "./comp.hd.js"

let system = new hd.ConstraintSystem();
let start = Date.now();

window.onload = () => {
    system.addComponent(comp);
    system.update();

    setInterval(function () {
        let delta = Date.now() - start;
        let value = Math.floor(delta / 100) / 10;
        comp.vs.duration.value.set(value);
    }, 100);

    maxBinder(document.getElementById('progress'), comp.vs.maxProgress);
    valueBinder(document.getElementById('progress'), comp.vs.duration);
    valueBinder(document.getElementById('duration'), comp.vs.maxDuration);
    innerTextBinder(document.getElementById('textTimer'), comp.vs.duration);

    document.getElementById('reset').addEventListener('click', () => {
        start = Date.now();
    });
}
