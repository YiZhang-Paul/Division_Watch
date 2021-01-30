import { ICategoryState, category } from './category/category.state';
import { ITaskItemState, taskItem } from './task-item/task-item.state';

type StoreType = {
    category: ICategoryState;
    taskItem: ITaskItemState;
};

export default createStore<StoreType>({
    modules: {
        category,
        taskItem
    }
});
