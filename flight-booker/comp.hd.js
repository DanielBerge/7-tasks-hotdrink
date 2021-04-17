export const comp = hd.component`
        var startDate = "", returnDate = "", returnDisabled, bookDisabled, flightType = "oneway";

        constraint {
            (flightType -> returnDisabled) => flightType === "oneway";
        }
        constraint {
            (flightType, startDate, returnDate -> bookDisabled) => {
              if (flightType === "oneway") {
                  return startDate === "";
              }
              if (flightType === "twoway") {
                 if (startDate === "" || returnDate === "") {
                     return true;
                 }
                 if (new Date(startDate).getTime() > new Date(returnDate).getTime()) {
                     return true;
                 }
               }
              return false;
            }
        }
`;
