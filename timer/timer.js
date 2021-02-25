let system = new hd.ConstraintSystem();
let start = Date.now();


function progressBinder(progress, max, value) {
    max.value.subscribe({
        next: val => {
            if (val.hasOwnProperty('value')) {
                progress.max = val.value;
            }
        }
    });
    value.value.subscribe({
        next: val => {
            if (val.hasOwnProperty('value')) {
                progress.value = val.value;
            }
        }
    });

    progress.addEventListener('input', () => {
        max.value.set(progress.max);
    });
}

function sliderBinder(slider, v) {
    v.value.subscribe({
        next: val => {
            if (val.hasOwnProperty('value')) {
                slider.value = val.value;
            }
        }
    });
    slider.addEventListener('input', () => {
        v.value.set(slider.value);
    });
}

function textBinder(text, v) {
    v.value.subscribe({
        next: val => {
            if (val.hasOwnProperty('value')) {
                text.innerText = v.value.value + "s";
            }
        }
    })
}

function onClick() {
    start = Date.now();
}

window.onload = () => {
    let component = hd.component`
        var maxTimer, maxDuration = 15, duration = 0;
        
        constraint {
            (maxDuration -> maxTimer) => maxDuration;
        }
    `;

    system.addComponent(component);
    system.update();

    setInterval(function () {
        let delta = Date.now() - start;
        let value = Math.floor(delta / 100) / 10;
        if (value >= component.vs.maxDuration.value.value) {
            component.vs.duration.value.set(component.vs.maxDuration.value.value);
        } else {
            component.vs.duration.value.set(value);
        }
    }, 100);

    progressBinder(document.getElementById('timer'), component.vs.maxTimer, component.vs.duration);
    sliderBinder(document.getElementById('duration'), component.vs.maxDuration);
    textBinder(document.getElementById('textTimer'), component.vs.duration);
}
