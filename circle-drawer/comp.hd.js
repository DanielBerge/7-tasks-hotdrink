export const comp = hd.component`
    var circles = [], history = [], undoDisabled = true, redoDisabled = true;
    var mouseX, mouseY;
    var ctx = canvas.getContext('2d');

    constraint {
        (circles -> undoDisabled) => circles.length === 0;
    }
    constraint {
        (history -> redoDisabled) => history.length === 0;
    }
`;
