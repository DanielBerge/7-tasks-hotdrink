let system = new hd.ConstraintSystem();
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const circles = [];
let selectedCircleIndex;

let adjust = document.getElementById("adjust");
let slider = document.getElementById("slider");

window.onload = () => {
    canvas.addEventListener('click', event => {
        let any = false;
        circles.forEach(circle => {
            if (ctx.isPointInPath(circle.path, event.offsetX, event.offsetY)) {
                adjust.style.display = "block";
                slider.value = circle.radius;
                selectedCircleIndex = circles.indexOf(circle);

                any = true;
            }
        })
        if (!any) {
            let path = new Path2D();
            path.arc(event.x - 10, event.y - 100, 40, 0, 2 * Math.PI);
            ctx.fillStyle = 'red';
            ctx.fill(path);
            circles.push({
                x: event.x - 10,
                y: event.y - 100,
                radius: 40,
                path: path,
            })
        }
    })

    canvas.addEventListener('mousemove', function (event) {
        circles.forEach(circle => {
            if (ctx.isPointInPath(circle.path, event.offsetX, event.offsetY)) {
                ctx.fillStyle = 'green';
            } else {
                ctx.fillStyle = 'red';
            }
            ctx.fill(circle.path);
        })
    });

    let span = document.getElementsByClassName("close")[0];
    span.onclick = function () {
        adjust.style.display = "none";
    }

    slider.addEventListener('input', () => {
        let obj = circles[selectedCircleIndex];
        obj.radius = slider.value;
        let newPath = new Path2D();
        newPath.arc(obj.x, obj.y, slider.value, 0, 2 * Math.PI);
        obj.path = newPath;
        ctx.fillStyle = 'red';
        ctx.fill(obj.path);
        circles[selectedCircleIndex] = obj;


        // Update canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        circles.forEach(circle => {
            ctx.fill(circle.path);
        });
    });
}