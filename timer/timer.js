let system = new hd.ConstraintSystem();
var count = 0.0;


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

function onClick() {
    count = 0.0;
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

    var timer = setInterval(function () {
        component.vs.duration.value.set(count);
        count = count + 0.1;
        if (count >= 30) {
            clearInterval(timer);
        }
    }, 100);

    progressBinder(document.getElementById('timer'), component.vs.maxTimer, component.vs.duration);
    sliderBinder(document.getElementById('duration'), component.vs.maxDuration);
}
