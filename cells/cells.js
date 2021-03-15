let system = new hd.ConstraintSystem();

function binder(element, value) {
    value.value.subscribe({
        next: val => {
            if (val.hasOwnProperty('value')) {
                element.innerText = val.value;
            }
        }
    })
}

function combiner(element, value) {
    value.value.set(element.innerText);
    element.addEventListener('change', () => {
        value.value.set(element.innerText);
    });
    element.addEventListener('DOMSubtreeModified', () => {
        value.value.set(element.innerText);
    });
}


function parseStr(str, td) {
    if (str.charAt(0) === "=") {
        let connectId = str.slice(1, 3);
        if (connectId.length === 2) {
            let component = hd.component`
                            var val, binded;
                            
                            constraint {
                                (binded -> val) => binded;
                            }
                        `;
            system.addComponent(component);
            system.update();
            binder(td, component.vs.val);
            combiner(document.getElementById(connectId.toUpperCase()), component.vs.binded);
        }
    } else if (str.slice(0, 4) === "sum(") {

    } else if (str.slice(0, 4) === "div(") {
        let connectId = str.slice(4, 6);
        let connectId2 = str.slice(7, 9);
        console.log(connectId);
        console.log(connectId2);
        let component = hd.component`
                            var val, divider, divisor;
                            
                            constraint {
                                (divider, divisor -> val) => divisor/divider;
                            }
                        `;
        system.addComponent(component);
        system.update();
        binder(td, component.vs.val);
        combiner(document.getElementById(connectId.toUpperCase()), component.vs.divider);
        combiner(document.getElementById(connectId2.toUpperCase()), component.vs.divisor);
    } else {
        td.innerText = str;
    }
}

function createColums() {
    for (let i = -1; i < 10; i++) {
        let td = document.createElement('td');
        if (i >= 0) {
            td.innerText = String.fromCharCode(i + 65);
        }
        document.getElementById('thead').appendChild(td);
    }
}

function createCells() {
    for (let i = 0; i < 10; i++) {
        let tr = document.createElement('tr');
        tr.innerText = i.toString();
        for (let j = 0; j < 10; j++) {
            let input = document.createElement('input');
            input.className = "inputField";
            let td = document.createElement('td');
            td.id = String.fromCharCode(j + 65) + i;

            input.type = "hidden";
            input.addEventListener('change', () => {
                parseStr(input.value, td);
                input.type = "hidden";
                td.appendChild(input);
            })


            td.addEventListener('click', () => {
                let inputs = document.getElementsByClassName('inputField');
                for (let input1 of inputs) {
                    input1.type = "hidden";
                }
                input.type = "text";
            })

            td.appendChild(input);
            tr.appendChild(td);
        }
        document.getElementById('tbody').appendChild(tr);
    }
}

window.onload = () => {
    createColums();
    createCells();

}