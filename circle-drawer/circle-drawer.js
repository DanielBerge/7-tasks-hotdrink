let system = new hd.ConstraintSystem();
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const circles = [];

window.onload = () => {
    canvas.addEventListener('click', event => {
        let any = false;
        circles.forEach(circle => {
            if (ctx.isPointInPath(circle.path, event.offsetX, event.offsetY)) {
                alert("Clicked");
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

            //ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fill(circle.path);
        })
    });
}
