import {disabledBinder, valueBinder} from "../packages/binders.js";

let system = new hd.ConstraintSystem();

window.onload = () => {
    let component = hd.component`
    component state {
        var one = "", two = "", twoDisabled, btnDisabled, flightType = "one";
        constraint {
            twoIsSelected(flightType -> twoDisabled) => flightType == "one";
        }
        constraint {
            btnState(flightType, one, two -> btnDisabled) => {
                if (flightType === "one" && one === "") {
                    return true;
                } else if (flightType === "two" && (one === "" || two === "")) {
                    return true;
                } else if (flightType === "two" && new Date(one).getTime() > new Date(two).getTime()) {
                    return true;
                }
                return false;
            }
        }
    }
     `;

    system.addComponent(component);
    system.update();

    valueBinder(document.getElementById("one"), component.vs.one);
    valueBinder(document.getElementById("two"), component.vs.two);
    disabledBinder(document.getElementById("two"), component.vs.twoDisabled);
    disabledBinder(document.getElementById("book"), component.vs.btnDisabled);
    valueBinder(document.getElementById("flightType"), component.vs.flightType);
}
