let system = new hd.ConstraintSystem();


window.onload = () => {
    document.addEventListener('click', event => {
        let canvas = document.getElementById("canvas");
        let ctx = canvas.getContext("2d");
        ctx.beginPath();
        ctx.arc(event.x, event.y, 40, 0, 2 * Math.PI);
        ctx.stroke();
    })
}
