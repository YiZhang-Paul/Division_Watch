export class Color {
    public r = 0;
    public g = 0;
    public b = 0;
    public a = 1;

    constructor(r = 0, g = 0, b = 0, a = 1) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    public static toString(color: Color): string {
        const { r, g, b, a } = color;

        return `rgba(${r}, ${g}, ${b}, ${a})`;
    }

    public static toColor(color: string): Color {
        if (!/^rgba?\((\s*\d+\s*,){2,3}(\s*\d+\s*)\)/.test(color)) {
            throw new Error('Invalid color string.');
        }

        const colors = color.replace(/rgba?\(|\)|\s/g, '').split(',').map(Number);

        return new Color(...colors);
    }
}
