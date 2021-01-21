import { createStore } from 'vuex';

import { ICategoryState, category } from './category/category.state';
import { ITaskItemState, taskItem } from './task-item/task-item.state';
import { IWatchBaseState, watchBase } from './watch-base/watch-base.state';

type StoreType = {
    category: ICategoryState;
    taskItem: ITaskItemState;
    watchBase: IWatchBaseState;
};

export default createStore<StoreType>({
    modules: {
        category,
        taskItem,
        watchBase
    }
});
