let system = new hd.ConstraintSystem();

function textBinder(box, v) {
    v.value.subscribe({
        next: val => {
            if (val.hasOwnProperty('value')) {
                box.value = val.value;
            }
        }
    });
    box.addEventListener('input', () => {
        v.value.set(parseFloat(box.value));
    });
}

window.onload = () => {
    let component = hd.component`
     var celcius = 0, fahrenheit;
     constraint TemperatureConverter {
       ToFahrenheit(celcius -> fahrenheit) => celcius * (9/5) + 32;
       ToCelcius(fahrenheit -> celcius) => (fahrenheit - 32) * (5/9);
     }
     `;

    system.addComponent(component);
    system.update();

    textBinder(document.getElementById("celcius"), component.vs.celcius);
    textBinder(document.getElementById("fahrenheit"), component.vs.fahrenheit);
}