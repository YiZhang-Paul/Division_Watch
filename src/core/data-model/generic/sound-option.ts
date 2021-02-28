import { SoundType } from '../../enums/sound-type.enum';

export class SoundOption {
    public name: string;
    public type: SoundType;
    public loop: boolean;

    constructor(name: string, type: SoundType, loop = false) {
        this.name = name;
        this.type = type;
        this.loop = loop;
    }
}
