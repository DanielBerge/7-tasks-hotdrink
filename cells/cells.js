let system = new hd.ConstraintSystem();


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
            let td = document.createElement('td');

            input.type = "hidden";
            input.addEventListener('change', () => {
                console.log(input.id);
                if (input.value.charAt(0) === "=") {
                    let connectId = input.value.slice(1, 3);
                    if (connectId.length === 2) {
                        td.innerText = document.getElementById(connectId).innerText;
                        input.type = "hidden";
                        td.appendChild(input);
                    }
                } else {
                    td.innerText = input.value;
                    input.type = "hidden";
                    td.appendChild(input);
                }
            })

            td.id = String.fromCharCode(j + 65) + i;

            td.addEventListener('click', () => {
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