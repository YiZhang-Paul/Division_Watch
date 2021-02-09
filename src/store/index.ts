import { createStore } from 'vuex';

import { IDialogState, dialog, dialogKey } from './dialog/dialog.state';
import { IMainViewState, mainView, mainViewKey } from './main-view/main-view.state';
import { ICategoryState, category, categoryKey } from './category/category.state';
import { ITaskItemState, taskItem, taskItemKey } from './task-item/task-item.state';
import { IWatchBaseState, watchBase, watchBaseKey } from './watch-base/watch-base.state';

type StoreType = {
    [dialogKey]: IDialogState,
    [mainViewKey]: IMainViewState;
    [categoryKey]: ICategoryState;
    [taskItemKey]: ITaskItemState;
    [watchBaseKey]: IWatchBaseState;
};

export default createStore<StoreType>({
    modules: {
        [dialogKey]: dialog,
        [mainViewKey]: mainView,
        [categoryKey]: category,
        [taskItemKey]: taskItem,
        [watchBaseKey]: watchBase
    }
});
