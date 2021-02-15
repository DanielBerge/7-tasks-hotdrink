import {oneWayBtnBinder, twoWaySelectBinder, twoWayTextBinder} from "../packages/hotdrink-binders";

let system = new hd.ConstraintSystem();

window.onload = () => {
    let component = hd.component`
    component state {
        var one = "", two = "", twoDisabled, btnDisabled, flightType = "one";
        constraint {
            oneIsFirst(one -> two) => one;
        }
        constraint {
            twoIsSelected(flightType -> twoDisabled) => flightType == "one";
        }
        constraint {
            btnState(flightType, one, two -> btnDisabled) => {
                if (flightType === "one" && one === "") {
                    return true;
                } else if (flightType === "two" && (one === "" || two === "")) {
                    return true;
                }
                return false;
            }
        }
    }
     `;

    system.addComponent(component);
    system.update();

    twoWayTextBinder(document.getElementById("one"), component.vs.one);
    twoWayTextBinder(document.getElementById("two"), component.vs.two, component.vs.twoDisabled);
    oneWayBtnBinder(document.getElementById("book"), component.vs.btnDisabled);
    twoWaySelectBinder(document.getElementById("flightType"), component.vs.flightType);
}
