import axios from 'axios';

import { SessionSettings } from '../../../data-model/settings/session-settings';
import { SessionSettingsOptions } from '../../../data-model/settings/session-settings-options';

export class AppSettingsHttpService {
    private readonly _api = `${process.env.VUE_APP_BASE_API_URL}/app-settings`;

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
