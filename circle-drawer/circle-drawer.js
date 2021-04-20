import {disabledBinder} from "../packages/binders.js";
import {comp} from "./comp.hd.js";

let system = new hd.ConstraintSystem();
const canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

let selectedCircleIndex;
let mouseX, mouseY;
let circles = () => comp.vs.circles.value.value;

let dummy;

let adjust = document.getElementById("adjust");
let slider = document.getElementById("slider");
let undo = document.getElementById('undo');
let redo = document.getElementById('redo');

function history(undo) {
    let cCopy = circles();
    let hCopy = comp.vs.history.value.value;
    if (undo) {
        let pop = cCopy.pop();
        if (pop.ref !== undefined) {
            cCopy[pop.ref].visible = true;
        }
        hCopy.push(pop);
    } else {
        let pop = hCopy.pop();
        if (pop.ref !== undefined && cCopy[pop.ref] !== undefined) {
            cCopy[pop.ref].visible = false;
        }
        cCopy.push(pop);
    }
    comp.vs.circles.value.set(cCopy);
    comp.vs.history.value.set(hCopy);
}

function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    circles().forEach(circle => {
        if (circle.visible) {
            if (ctx.isPointInPath(circle.path, mouseX, mouseY)) {
                ctx.fillStyle = 'green';
            } else {
                ctx.fillStyle = 'grey';
            }
            ctx.fill(circle.path);
        }
    });
    if (dummy) {
        ctx.fillStyle = 'grey';
        ctx.fill(dummy.path);
    }
    window.requestAnimationFrame(tick);
}

window.onload = () => {
    system.addComponent(comp);
    system.update();
    window.requestAnimationFrame(tick);

    disabledBinder(undo, comp.vs.undoDisabled);
    disabledBinder(redo, comp.vs.redoDisabled);

    undo.addEventListener('click', () => history(true));
    redo.addEventListener('click', () => history(false));

    canvas.addEventListener('click', event => {
        let any = false;
        circles().forEach(circle => {
            if (ctx.isPointInPath(circle.path, mouseX, mouseY) && circle.visible) {
                // Placement of modal
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
                visible: true,
            })
            comp.vs.circles.value.set(copy)
            comp.vs.history.value.set([]);
        }
    })


    canvas.addEventListener('mousemove', function (event) {
        mouseX = event.offsetX;
        mouseY = event.offsetY;
    });


    slider.addEventListener('input', () => {
        let copy = circles();
        let obj = copy[selectedCircleIndex];
        obj.visible = false;
        copy[selectedCircleIndex] = obj;
        comp.vs.circles.value.set(copy);

        let newPath = new Path2D();
        newPath.arc(obj.x, obj.y, slider.value, 0, 2 * Math.PI);

        dummy = {
            x: obj.x,
            y: obj.y,
            radius: slider.value,
            path: newPath,
            visible: true,
            ref: selectedCircleIndex,
        }

    });
}

function saveSlide() {
    let copy = circles();
    let obj = copy[selectedCircleIndex];
    obj.visible = false;

    dummy = undefined;

    let newPath = new Path2D();
    newPath.arc(obj.x, obj.y, slider.value, 0, 2 * Math.PI);

    copy.push({
        x: obj.x,
        y: obj.y,
        radius: slider.value,
        path: newPath,
        visible: true,
        ref: selectedCircleIndex,
    });

    copy[selectedCircleIndex] = obj;
    comp.vs.circles.value.set(copy);
    comp.vs.history.value.set([]);
}

// When the user clicks on <span> (x), close the modal
let span = document.getElementsByClassName("close")[0];
span.onclick = function () {
    adjust.style.display = "none";
    saveSlide();
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target === adjust) {
        adjust.style.display = "none";
        saveSlide();
    }
}
