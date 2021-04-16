import {disabledBinder} from "../packages/binders.js";

let system = new hd.ConstraintSystem();
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let selectedCircleIndex;

let adjust = document.getElementById("adjust");
let slider = document.getElementById("slider");
let undo = document.getElementById('undo');
let redo = document.getElementById('redo');

window.onload = () => {
    let component = hd.component`
        var circles = [], history = [], undoDisabled = true, redoDisabled = true;
        var mouseX, mouseY;
        
        constraint {
            (circles -> undoDisabled) => circles.length === 0;
        }
        constraint {
            (history -> redoDisabled) => history.length === 0;
        }
    `;

    system.addComponent(component);
    system.update();

    disabledBinder(undo, component.vs.undoDisabled);
    disabledBinder(redo, component.vs.redoDisabled);

    function history(undo) {
        let cCopy = component.vs.circles.value.value;
        let hCopy = component.vs.history.value.value;
        if (undo) {
            hCopy.push(cCopy.pop());
        } else {
            cCopy.push(hCopy.pop());
        }
        component.vs.circles.value.set(cCopy);
        component.vs.history.value.set(hCopy);
    }

    undo.addEventListener('click', () => history(true));
    redo.addEventListener('click', () => history(false));

    canvas.addEventListener('click', event => {
        let any = false;
        component.vs.circles.value.value.forEach(circle => {
            if (ctx.isPointInPath(circle.path, event.offsetX, event.offsetY)) {
                adjust.style.display = "block";
                adjust.style.top = circle.y + "px";
                adjust.style.left = circle.x + "px";
                slider.value = circle.radius;
                selectedCircleIndex = component.vs.circles.value.value.indexOf(circle);
                any = true;
            }
        })
        if (!any) {
            let path = new Path2D();
            path.arc(event.x - 10, event.y - 100, 40, 0, 2 * Math.PI);
            let copy = component.vs.circles.value.value;
            copy.push({
                x: event.x - 10,
                y: event.y - 100,
                radius: 40,
                path: path,
            })
            component.vs.circles.value.set(copy)
            component.vs.history.value.set([]);
        }
    })

    function tick() {
        console.log("tick");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        component.vs.circles.value.value.forEach(circle => {
            if (ctx.isPointInPath(circle.path, component.vs.mouseX.value.value, component.vs.mouseY.value.value)) {
                ctx.fillStyle = 'green';
            } else {
                ctx.fillStyle = 'grey';
            }
            ctx.fill(circle.path);
        });
        window.requestAnimationFrame(tick);
    }

    window.requestAnimationFrame(tick);

    canvas.addEventListener('mousemove', function (event) {
        component.vs.mouseX.value.set(event.offsetX);
        component.vs.mouseY.value.set(event.offsetY);
    });


    slider.addEventListener('input', () => {
        let copy = component.vs.circles.value.value;
        let obj = copy[selectedCircleIndex];
        obj.radius = slider.value;

        let newPath = new Path2D();
        newPath.arc(obj.x, obj.y, slider.value, 0, 2 * Math.PI);
        obj.path = newPath;

        copy[selectedCircleIndex] = obj;
        component.vs.circles.value.set(copy);
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
