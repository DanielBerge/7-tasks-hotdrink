import {disabledBinder, valueBinder} from "../packages/binders.js";

let system = new hd.ConstraintSystem();

window.onload = () => {
    let component = hd.component`
    component state {
        var startDate = "", returnDate = "", returnDisabled, bookDisabled, flightType = "start";
        constraint {
            twoIsSelected(flightType -> returnDisabled) => flightType == "start";
        }
        constraint {
            btnState(flightType, startDate, returnDate -> bookDisabled) => {
                if (flightType === "start" && startDate === "") {
                    return true;
                } else if (flightType === "return" && (startDate === "" || returnDate === "")) {
                    return true;
                } else if (flightType === "return" && new Date(startDate).getTime() > new Date(returnDate).getTime()) {
                    return true;
                }
                return false;
            }
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
