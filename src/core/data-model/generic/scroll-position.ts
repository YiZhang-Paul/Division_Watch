export class ScrollPosition {
    public isTop: boolean;
    public isBottom: boolean;

    constructor(isTop = true, isBottom = false) {
        this.isTop = isTop;
        this.isBottom = isBottom;
    }
}
