import axios from 'axios';

import { Goal } from '../../../data-model/generic/goal';
import { DailyPlan } from '../../../data-model/generic/daily-plan';

export class DailyPlanHttpService {
    private readonly _api = `${process.env.VUE_APP_BASE_API_URL}/daily-plan`;

    public async getGoalOptions(): Promise<Goal[]> {
        try {
            const endpoint = `${this._api}/goals`;

            return (await axios.get(endpoint)).data;
        }
        catch {
            return [];
        }
    }

    public async getDailyPlan(date: Date): Promise<DailyPlan> {
        try {
            const endpoint = `${this._api}/${date.toISOString()}`;

            return (await axios.get(endpoint)).data;
        }
        catch {
            return new DailyPlan(date);
        }
    }

    public async upsertDailyPlan(plan: DailyPlan): Promise<DailyPlan | null> {
        try {
            return (await axios.put(this._api, plan)).data;
        }
        catch {
            return null;
        }
    }
}
