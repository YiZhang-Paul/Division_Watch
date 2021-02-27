export class Sound {
    public readonly name: string;
    private file: HTMLAudioElement;
    private timeoutTimer: NodeJS.Timeout | null = null;
    private intervalTimer: NodeJS.Timeout | null = null;
    private _volume = 1;

    constructor(name: string) {
        this.name = name;
        this.file = new Audio(`division-protocol://src/assets/sounds/${name}.mp3`);
    }

    set volume(value: number) {
        this._volume = Math.max(0, Math.min(value, 1));
    }

    public loop(interval = 1000): void {
        this.intervalTimer = setTimeout(() => this.loop(interval), interval);
        this.play(0);
    }

    public play(delay = 0): void {
        if (this.timeoutTimer) {
            clearTimeout(this.timeoutTimer);
        }

        this.timeoutTimer = setTimeout(() => {
            this.file.volume = this._volume;
            this.file.play();
        }, delay);
    }

    public stop(): void {
        if (this.timeoutTimer) {
            clearTimeout(this.timeoutTimer);
            this.timeoutTimer = null;
        }

        if (this.intervalTimer) {
            clearTimeout(this.intervalTimer);
            this.intervalTimer = null;
        }
    }
}
