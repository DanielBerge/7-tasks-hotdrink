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

export function disabledBinder(element, disabled) {
    disabled.value.subscribe({
        next: val => {
            if (val.hasOwnProperty('value')) {
                element.disabled = val.value;
            }
        }
    });
    element.addEventListener('input', () => {
        disabled.value.set(element.disabled);
    });
}

export function maxBinder(element, max) {
    max.value.subscribe({
        next: val => {
            if (val.hasOwnProperty('value')) {
                element.max = val.value;
            }
        }
    });
    element.addEventListener('input', () => {
        max.value.set(element.max);
    });
}
