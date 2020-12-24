export class AnimationService {

    public getBlur(changes: { start: number; end: number; duration: number }[], elapsed: number): number {
        const cycleDuration = changes.reduce((total, _) => _.duration + total, 0);

        if (!cycleDuration) {
            return 0;
        }

        let currentCycle = elapsed % cycleDuration;

        for (const { start, end, duration } of changes) {
            if (currentCycle < duration) {
                return (end - start) * currentCycle / duration + start;
            }

            currentCycle -= duration;
        }

        return 0;
    }

    public getAngle(changes: { change: number; duration: number }[], elapsed: number): number {
        const cycleDuration = changes.reduce((total, _) => _.duration + total, 0);

        if (!cycleDuration) {
            return 0;
        }

        const fullCycles = Math.floor(elapsed / cycleDuration);
        const cycleChange = changes.reduce((total, _) => _.change + total, 0);
        let totalChange = fullCycles * cycleChange % 360;
        let currentCycle = elapsed % cycleDuration;

        for (const { change, duration } of changes) {
            if (currentCycle < duration) {
                totalChange += change * currentCycle / duration;

                break;
            }

            currentCycle -= duration;
            totalChange += change;
        }

        return Math.floor(totalChange * 100) / 100;
    }
}
