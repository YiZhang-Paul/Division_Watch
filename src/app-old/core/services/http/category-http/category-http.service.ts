export class CategoryHttpService {
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
