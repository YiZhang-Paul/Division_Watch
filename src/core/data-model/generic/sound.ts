export class Sound {
    private file: HTMLAudioElement;
    private timeoutTimer: NodeJS.Timeout | null = null;
    private intervalTimer: NodeJS.Timeout | null = null;

    constructor(name: string) {
        this.file = new Audio(`division-protocol://src/assets/sounds/${name}.mp3`);
    }

    public loop(interval = 1000, volume = 1): void {
        this.intervalTimer = setTimeout(() => this.loop(interval), interval);
        this.play(0, volume);
    }

    public play(delay = 0, volume = 1): void {
        if (this.timeoutTimer) {
            clearTimeout(this.timeoutTimer);
        }

        this.timeoutTimer = setTimeout(() => {
            this.file.volume = volume;
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
