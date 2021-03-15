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


function createCells() {
    for (let i = -1; i < 10; i++) {
        let td = document.createElement('td');
        if (i >= 0) {
            td.innerText = String.fromCharCode(i + 65);
        }
        document.getElementById('thead').appendChild(td);
    }

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
                if (input.value.charAt(0) === "=") {
                    let connectId = input.value.slice(1, 3);
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
                        combiner(document.getElementById(connectId), component.vs.binded);
                    }
                } else {
                    td.innerText = input.value;
                }
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
    createCells();

}