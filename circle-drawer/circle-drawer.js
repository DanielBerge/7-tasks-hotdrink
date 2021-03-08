let system = new hd.ConstraintSystem();


window.onload = () => {
    let canvas = document.getElementById("canvas");
    canvas.addEventListener('click', event => {
        let ctx = canvas.getContext("2d");
        ctx.beginPath();
        ctx.arc(event.x - 10, event.y - 100, 40, 0, 2 * Math.PI);
        ctx.stroke();
    })
}
