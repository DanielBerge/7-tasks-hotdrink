export const comp = hd.component`
     var celcius, fahrenheit;

     constraint {
       (celcius -> fahrenheit) => celcius * (9/5) + 32;
       (fahrenheit -> celcius) => (fahrenheit - 32) * (5/9);
     }
     `;
