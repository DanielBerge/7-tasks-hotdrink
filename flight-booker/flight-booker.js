let system = new hd.ConstraintSystem();


function textBinder(box, v, disabled) {
    if (disabled !== undefined) {
        disabled.value.subscribe({
            next: val => {
                box.disabled = val.value;
            }
        });
    }
    v.value.subscribe({
        next: val => {
            if (val.hasOwnProperty('value')) {
                box.value = val.value;
            }
        }
    });
    box.addEventListener('input', () => {
        v.value.set(box.value);
    });
}

function btnBinder(btn, disabled) {
    disabled.value.subscribe({
        next: val => {
            console.log(val.value);
            btn.disabled = val.value;
        }
    });
}

function selectBinder(sel, v) {
    v.value.subscribe({
        next: val => {
            if (val.hasOwnProperty('value')) {
                sel.value = val.value;
            }
        }
    });
    sel.addEventListener('input', () => {
        v.value.set(sel.value);
    });
}

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

    textBinder(document.getElementById("one"), component.vs.one);
    textBinder(document.getElementById("two"), component.vs.two, component.vs.twoDisabled);
    btnBinder(document.getElementById("book"), component.vs.btnDisabled);
    selectBinder(document.getElementById("flightType"), component.vs.flightType);
}
