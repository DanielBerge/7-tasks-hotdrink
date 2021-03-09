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
            let td = document.createElement('td');
            let input = document.createElement('input');
            input.id = String.fromCharCode(j + 65) + i;
            input.addEventListener('change', () => {
                console.log(input.id);
                if (input.value.charAt(0) === "=") {
                    let connectId = input.value.slice(1, 3);
                    if (connectId.length === 2) {
                        console.log(connectId);
                    }
                }
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