import {disabledBinder} from "../packages/binders.js";
import {comp} from "./comp.hd.js";

let system = new hd.ConstraintSystem();
const canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

let selectedCircleIndex;
let mouseX, mouseY;

let dummy;

let adjust = document.getElementById("adjust");
let slider = document.getElementById("slider");
let undo = document.getElementById('undo');
let redo = document.getElementById('redo');

function history(undo) {
    let vals = [comp.vs.circles.value, comp.vs.history.value];
    system.scheduleCommand(vals, vals, (circles, history) => {
        if (undo) {
            let pop = circles.pop();
            if (pop.ref !== undefined) {
                circles[pop.ref].visible = true;
            }
            history.push(pop);
        } else {
            let pop = history.pop();
            if (pop.ref !== undefined && circles[pop.ref] !== undefined) {
                circles[pop.ref].visible = false;
            }
            circles.push(pop);
        }
        return [circles, history];
    })
}

function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    comp.vs.circles.value.value.forEach(circle => {
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
        if (dummy !== undefined) {
            saveSlide();
        }
        let any = false;
        comp.vs.circles.value.value.forEach(circle => {
            if (ctx.isPointInPath(circle.path, mouseX, mouseY) && circle.visible) {
                // Placement of modal
                adjust.style.display = "block";
                adjust.style.top = circle.y + "px";
                adjust.style.left = circle.x + "px";

                slider.value = circle.radius;
                selectedCircleIndex = comp.vs.circles.value.value.indexOf(circle);
                any = true;
            }
        });
        if (!any) {
            let path = new Path2D();
            path.arc(event.x - 10, event.y - 100, 40, 0, 2 * Math.PI);

            system.scheduleCommand([comp.vs.circles.value], [comp.vs.circles.value, comp.vs.history.value], (circles) => {
                circles.push({
                    x: event.x - 10,
                    y: event.y - 100,
                    radius: 40,
                    path: path,
                    visible: true,
                })
                return [circles, []];
            })
        }
    })


    canvas.addEventListener('mousemove', function (event) {
        mouseX = event.offsetX;
        mouseY = event.offsetY;
    });


    slider.addEventListener('input', () => {
        system.scheduleCommand([comp.vs.circles.value], [comp.vs.circles.value], (circles) => {
            let obj = circles[selectedCircleIndex];
            obj.visible = false;
            circles[selectedCircleIndex] = obj;

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
            return circles;
        })
    });
}

function saveSlide() {
    system.scheduleCommand([comp.vs.circles.value], [comp.vs.circles.value, comp.vs.history.value], (circles) => {
        let obj = circles[selectedCircleIndex];
        obj.visible = false;

        dummy = undefined;

        let newPath = new Path2D();
        newPath.arc(obj.x, obj.y, slider.value, 0, 2 * Math.PI);

        circles.push({
            x: obj.x,
            y: obj.y,
            radius: slider.value,
            path: newPath,
            visible: true,
            ref: selectedCircleIndex,
        });

        circles[selectedCircleIndex] = obj;
        return [circles, []]
    })

}

// When the user clicks on <span> (x), close the modal
let span = document.getElementsByClassName("close")[0];
span.onclick = function () {
    adjust.style.display = "none";
    saveSlide();
}