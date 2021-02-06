import axios from 'axios';

import { Category } from '../../../data-model/generic/category';

export class CategoryHttpService {
    private readonly _api = `${process.env.VUE_APP_BASE_API_URL}/category`;

    public async getCategories(): Promise<Category[]> {
        try {
            return (await axios.get(this._api)).data;
        }
        catch {
            return [];
        }
    }
}