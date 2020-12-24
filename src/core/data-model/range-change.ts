export class RangeChange {
    public start: number;
    public end: number;
    public duration: number;

    constructor(start: number, end: number, duration: number) {
        this.start = start;
        this.end = end;
        this.duration = duration;
    }
}
