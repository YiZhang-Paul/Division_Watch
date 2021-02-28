import axios from 'axios';

import { SoundSettings } from '../../../data-model/settings/sound-settings';
import { SoundSettingsOptions } from '../../../data-model/settings/sound-settings-options';
import { SessionSettings } from '../../../data-model/settings/session-settings';
import { SessionSettingsOptions } from '../../../data-model/settings/session-settings-options';

export class AppSettingsHttpService {
    private readonly _api = `${process.env.VUE_APP_BASE_API_URL}/app-settings`;

    public async getSoundSettings(): Promise<SoundSettings> {
        try {
            return (await axios.get(`${this._api}/sound`)).data;
        }
        catch {
            return new SoundSettings();
        }
    }

    public async getSoundSettingsOptions(): Promise<SoundSettingsOptions> {
        try {
            return (await axios.get(`${this._api}/sound/options`)).data;
        }
        catch {
            return new SoundSettingsOptions();
        }
    }

    public async updateSoundSettings(settings: SoundSettings): Promise<boolean> {
        try {
            return (await axios.put(`${this._api}/sound`, settings)).data;
        }
        catch {
            return false;
        }
    }

    public async getSessionSettings(): Promise<SessionSettings> {
        try {
            return (await axios.get(`${this._api}/session`)).data;
        }
        catch {
            return new SessionSettings();
        }
    }

    public async getSessionSettingsOptions(): Promise<SessionSettingsOptions> {
        try {
            return (await axios.get(`${this._api}/session/options`)).data;
        }
        catch {
            return new SessionSettingsOptions();
        }
    }

    public async updateSessionSettings(settings: SessionSettings): Promise<boolean> {
        try {
            return (await axios.put(`${this._api}/session`, settings)).data;
        }
        catch {
            return false;
        }
    }
}
