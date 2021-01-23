import axios from 'axios';

import { Category } from '../../../data-model/category';

export class CategoryHttpService {
    private readonly _api = `${process.env.VUE_APP_BASE_API_URL}/category`;

    public async getCategories(): Promise<Category[]> {
        return (await axios.get(this._api)).data;
    }

    public async addCategory(category: Category): Promise<Category> {
        return (await axios.post(this._api, category)).data;
    }

    public async updateCategory(category: Category): Promise<boolean> {
        return (await axios.put(this._api, category)).data;
    }

    public async deleteCategory(category: Category): Promise<boolean> {
        const endpoint = `${this._api}/${category.id}`;

        return (await axios.delete(endpoint)).data;
    }
}
