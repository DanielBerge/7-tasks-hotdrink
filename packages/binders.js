function binder(element, value, type) {
    value.value.subscribe({
        next: val => {
            if (val.hasOwnProperty('value')) {
                element[type] = val.value;
            }
        }
    });
    element.addEventListener('input', () => {
        value.value.set(element[type]);
    });
}

export function valueBinder(element, value) {
    binder(element, value, "value");
}

export function disabledBinder(element, value) {
    binder(element, value, "disabled");
}

export function maxBinder(element, value) {
    binder(element, value, "max");
}

export function innerTextBinder(text, value) {
    value.value.subscribe({
        next: val => {
            if (val.hasOwnProperty('value')) {
                text.innerText = value.value.value;
            }
        }
    })
}
