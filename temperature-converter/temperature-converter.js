import {twoWayNumberTextBinder} from "../packages/hotdrink-binders";

let system = new hd.ConstraintSystem();

window.onload = () => {
    let component = hd.component`
     var celcius = 0, fahrenheit;
     constraint TemperatureConverter {
       toFahrenheit(celcius -> fahrenheit) => celcius * (9/5) + 32;
       toCelcius(fahrenheit -> celcius) => (fahrenheit - 32) * (5/9);
     }
     `;

    system.addComponent(component);
    system.update();

    twoWayNumberTextBinder(document.getElementById("celcius"), component.vs.celcius);
    twoWayNumberTextBinder(document.getElementById("fahrenheit"), component.vs.fahrenheit);
}