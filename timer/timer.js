import {innerTextBinder, maxBinder, valueBinder} from "../packages/binders.js";

let system = new hd.ConstraintSystem();
let start = Date.now();

window.onload = () => {
    let component = hd.component`
        var maxProgress, maxDuration = 15, duration = 0;
        
        constraint {
            (maxDuration -> maxProgress) => maxDuration;
        }
        constraint {
            (maxDuration, duration -> duration) => Math.min(duration, maxDuration);
        }
    `;

    system.addComponent(component);
    system.update();

    setInterval(function () {
        let delta = Date.now() - start;
        let value = Math.floor(delta / 100) / 10;
        component.vs.duration.value.set(value);
    }, 100);

    maxBinder(document.getElementById('progress'), component.vs.maxProgress);
    valueBinder(document.getElementById('progress'), component.vs.duration);
    valueBinder(document.getElementById('duration'), component.vs.maxDuration);
    innerTextBinder(document.getElementById('textTimer'), component.vs.duration);

    document.getElementById('reset').addEventListener('click', () => {
        start = Date.now();
    });
}
