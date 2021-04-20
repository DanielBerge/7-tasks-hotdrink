export const comp = hd.component`
    var maxProgress, maxDuration = 15, duration = 0;

    constraint {
        (maxDuration -> maxProgress) => maxDuration;
    }
    constraint {
        (maxDuration, duration -> duration) => Math.min(duration, maxDuration);
    }
`;
