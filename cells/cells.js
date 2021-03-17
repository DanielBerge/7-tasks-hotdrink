let system = new hd.ConstraintSystem();

const COLUMNS = 26;
const ROWS = 100;

function textBinder(element, value) {
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
            textBinder(td, component.vs.val);
            combiner(document.getElementById(connectId.toUpperCase()), component.vs.binded);
        }
    } else if (str.slice(0, 4) === "sum(") {
        let connectId = str.slice(4, 6);
        let connectId2 = str.slice(7, 9);
        let component = hd.component`
                            var sum, first, second;
                            
                            constraint {
                                (first, second -> sum) => parseInt(first) + parseInt(second);
                            }
                        `;
        system.addComponent(component);
        system.update();
        textBinder(td, component.vs.sum);
        combiner(document.getElementById(connectId.toUpperCase()), component.vs.first);
        combiner(document.getElementById(connectId2.toUpperCase()), component.vs.second);
    } else if (str.slice(0, 4) === "div(") {
        let connectId = str.slice(4, 6);
        let connectId2 = str.slice(7, 9);
        let component = hd.component`
                            var quotient, divisor, dividend;
                            
                            constraint {
                                (dividend, divisor -> quotient) => dividend/divisor;
                            }
                        `;
        system.addComponent(component);
        system.update();
        textBinder(td, component.vs.quotient);
        combiner(document.getElementById(connectId.toUpperCase()), component.vs.dividend);
        combiner(document.getElementById(connectId2.toUpperCase()), component.vs.divisor);
    } else {
        td.innerText = str;
    }
}

function createColums() {
    for (let i = -1; i < COLUMNS; i++) {
        let td = document.createElement('td');
        if (i >= 0) {
            td.innerText = String.fromCharCode(i + 65);
        }
        document.getElementById('thead').appendChild(td);
    }
}

function createCells() {
    for (let i = 0; i < ROWS; i++) {
        let tr = document.createElement('tr');
        tr.innerText = i.toString();
        for (let j = 0; j < COLUMNS; j++) {
            let input = document.createElement('input');
            input.className = "inputField";
            let td = document.createElement('td');
            td.id = String.fromCharCode(j + 65) + i;
            input.type = "hidden";

            //Parse input when changed
            input.addEventListener('change', () => {
                parseStr(input.value, td);
                input.type = "hidden";
                td.appendChild(input);
            })


            //Show input field on click
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