export class CategoryHttpService {
    public async deleteCategory(category: Category): Promise<boolean> {
        const endpoint = `${this._api}/${category.id}`;

        return (await axios.delete(endpoint)).data;
    }
}
