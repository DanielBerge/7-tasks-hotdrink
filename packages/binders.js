export function valueBinder(element, value) {
    value.value.subscribe({
        next: val => {
            if (val.hasOwnProperty('value')) {
                element.value = val.value;
            }
        }
    });
    element.addEventListener('input', () => {
        value.value.set(element.value);
    });
}

export function disabledBinder(element, value) {
    value.value.subscribe({
        next: val => {
            if (val.hasOwnProperty('value')) {
                element.disabled = val.value;
            }
        }
    });
    element.addEventListener('input', () => {
        value.value.set(element.disabled);
    });
}