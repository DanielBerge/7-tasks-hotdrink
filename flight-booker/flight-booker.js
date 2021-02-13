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

function btnBinder(btn, v) {
    v.value.subscribe({
        next: val => {
            if (val.hasOwnProperty('value')) {
                btn.disabled = val.value;
            }
        }
    })
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
        var one = new Date(), two = new Date();
        constraint Date {
            oneIsFirst(one -> two) => one;
        }
     `;

    let stateComponent = hd.component`
        var type = "one", twoDisabled, btnDisabled = true;
        constraint State {
            twoIsSelected(type -> twoDisabled) => type == "one";
        }
    `;

    system.addComponent(component);
    system.addComponent(stateComponent);
    system.update();

    textBinder(document.getElementById("one"), component.vs.one);
    textBinder(document.getElementById("two"), component.vs.two, stateComponent.vs.twoDisabled);
    btnBinder(document.getElementById("book"), stateComponent.vs.btnDisabled);
    selectBinder(document.getElementById("type"), stateComponent.vs.type);
}
