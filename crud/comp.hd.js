export const comp = hd.component`
    var names = ["Emil, Hans", "Mustermann, Max", "Tich, Roman"];
    var changing = ", ", name, surname, filtered = [], filter = "";

    constraint {
        (changing -> name, surname) => {
            let s = changing.split(', ');
            return [s[0], s[1]];
        }
        (name, surname -> changing) => {
            return name + ", " + surname;
        }
    }

    constraint {
        (filter, names -> filtered) => names.filter((value) => value.toLowerCase().includes(filter.toLowerCase()));
    }
`;
