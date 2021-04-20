import {disabledBinder} from "../packages/binders.js";
import {comp} from "./comp.hd.js";

let system = new hd.ConstraintSystem();
const canvas = document.getElementById('canvas');

let selectedCircleIndex;
let ctx = () => comp.vs.ctx.value.value;
let circles = () => comp.vs.circles.value.value;

let adjust = document.getElementById("adjust");
let slider = document.getElementById("slider");
let undo = document.getElementById('undo');
let redo = document.getElementById('redo');

function history(undo) {
    let cCopy = comp.vs.circles.value.value;
    let hCopy = comp.vs.history.value.value;
    if (undo) {
        hCopy.push(cCopy.pop());
    } else {
        cCopy.push(hCopy.pop());
    }
    comp.vs.circles.value.set(cCopy);
    comp.vs.history.value.set(hCopy);
}

window.onload = () => {
    system.addComponent(comp);
    system.update();

    disabledBinder(undo, comp.vs.undoDisabled);
    disabledBinder(redo, comp.vs.redoDisabled);

    undo.addEventListener('click', () => history(true));
    redo.addEventListener('click', () => history(false));

    canvas.addEventListener('click', event => {
        let any = false;
        circles().forEach(circle => {
            if (ctx().isPointInPath(circle.path, comp.vs.mouseX.value.value, comp.vs.mouseY.value.value)) {
                adjust.style.display = "block";
                adjust.style.top = circle.y + "px";
                adjust.style.left = circle.x + "px";
                slider.value = circle.radius;
                selectedCircleIndex = circles().indexOf(circle);
                any = true;
            }
        });
        if (!any) {
            let path = new Path2D();
            path.arc(event.x - 10, event.y - 100, 40, 0, 2 * Math.PI);
            let copy = circles();
            copy.push({
                x: event.x - 10,
                y: event.y - 100,
                radius: 40,
                path: path,
            })
            comp.vs.circles.value.set(copy)
            comp.vs.history.value.set([]);
        }
    })

    function tick() {
        console.log("tick");
        ctx().clearRect(0, 0, canvas.width, canvas.height);
        circles().forEach(circle => {
            if (ctx().isPointInPath(circle.path, comp.vs.mouseX.value.value, comp.vs.mouseY.value.value)) {
                ctx().fillStyle = 'green';
            } else {
                ctx().fillStyle = 'grey';
            }
            ctx().fill(circle.path);
        });
        window.requestAnimationFrame(tick);
    }

    window.requestAnimationFrame(tick);

    canvas.addEventListener('mousemove', function (event) {
        comp.vs.mouseX.value.set(event.offsetX);
        comp.vs.mouseY.value.set(event.offsetY);
    });


    slider.addEventListener('input', () => {
        let copy = circles();
        let obj = copy[selectedCircleIndex];
        obj.radius = slider.value;

        let newPath = new Path2D();
        newPath.arc(obj.x, obj.y, slider.value, 0, 2 * Math.PI);
        obj.path = newPath;

        copy[selectedCircleIndex] = obj;
        comp.vs.circles.value.set(copy);
        //TODO add schedulecommand
    });
}

// When the user clicks on <span> (x), close the modal
let span = document.getElementsByClassName("close")[0];
span.onclick = function () {
    adjust.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target === adjust) {
        adjust.style.display = "none";
    }
}
