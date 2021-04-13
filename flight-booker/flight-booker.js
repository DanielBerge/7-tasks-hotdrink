import {disabledBinder, valueBinder} from "../packages/binders.js";

let system = new hd.ConstraintSystem();

window.onload = () => {
    let component = hd.component`
    component state {
        var startDate = "", returnDate = "", returnDisabled, bookDisabled, flightType = "oneway";
        constraint {
            (flightType -> returnDisabled) => flightType == "oneway";
        }
        constraint {
            (flightType, startDate, returnDate -> bookDisabled) =>
                (flightType === "oneway" && startDate === "")
                || (flightType === "twoway") 
                && ((startDate === "" || returnDate === "")
                    || (new Date(startDate).getTime() > new Date(returnDate).getTime()));
        }
    }
     `;

    system.addComponent(component);
    system.update();

    valueBinder(document.getElementById("start"), component.vs.startDate);
    valueBinder(document.getElementById("return"), component.vs.returnDate);
    disabledBinder(document.getElementById("return"), component.vs.returnDisabled);
    disabledBinder(document.getElementById("book"), component.vs.bookDisabled);
    valueBinder(document.getElementById("flightType"), component.vs.flightType);
}
