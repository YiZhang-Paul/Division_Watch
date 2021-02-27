export class Sound {
    public readonly name: string;
    private file: HTMLAudioElement;
    private _volume = 1;

    constructor(name: string) {
        this.name = name;
        this.file = new Audio(`division-protocol://src/assets/sounds/${name}.wav`);
    }

    set volume(value: number) {
        this._volume = Math.max(0, Math.min(value, 1));
        this.file.volume = this._volume;
    }

    public play(loop: boolean): void {
        this.file.volume = this._volume;
        this.file.loop = loop;
        this.file.play();
    }

    public stop(): void {
        this.file.pause();
        this.file.currentTime = 0;
        this.file.loop = false;
    }
}
