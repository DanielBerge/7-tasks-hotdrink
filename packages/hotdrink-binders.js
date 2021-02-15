export function twoWayTextBinder(box, v, disabled) {
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

export function twoWayNumberTextBinder(box, v) {
    v.value.subscribe({
        next: val => {
            if (val.hasOwnProperty('value')) {
                box.value = val.value;
            }
        }
    });
    box.addEventListener('input', () => {
        v.value.set(parseFloat(box.value));
    });
}


export function twoWaySelectBinder(sel, v) {
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

export function oneWayBtnBinder(btn, disabled) {
    disabled.value.subscribe({
        next: val => {
            btn.disabled = val.value;
        }
    });
}
