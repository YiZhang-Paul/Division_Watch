import axios from 'axios';

import { SessionSettings } from '../../../data-model/settings/session-settings';

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
}
