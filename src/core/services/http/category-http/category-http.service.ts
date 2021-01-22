import axios from 'axios';

import { Category } from '../../../data-model/category';

export class CategoryHttpService {
    private readonly _api = `${process.env.VUE_APP_BASE_API_URL}/category`;

    public async getCategories(): Promise<Category[]> {
        return (await axios.get(this._api)).data;
    }

    public async updateCategory(category: Category): Promise<true> {
        return (await axios.put(this._api, category)).data;
    }
}
