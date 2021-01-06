import { createStore } from 'vuex';

import { ITaskItemState, taskItem } from './task-item/task-item.state';
import { IWatchBaseState, watchBase } from './watch-base/watch-base.state';

export default createStore<{ taskItem: ITaskItemState, watchBase: IWatchBaseState }>({
    modules: {
        taskItem,
        watchBase
    }
});
