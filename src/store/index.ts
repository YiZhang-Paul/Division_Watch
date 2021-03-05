import { createStore } from 'vuex';

import { IDialogState, dialog, dialogKey } from './dialog/dialog.state';
import { ISettingsState, settings, settingsKey } from './settings/settings.state';
import { ISoundState, sound, soundKey } from './sound/sound.state';
import { IMainViewState, mainView, mainViewKey } from './main-view/main-view.state';
import { ICategoryState, category, categoryKey } from './category/category.state';
import { IDailyPlanState, dailyPlan, dailyPlanKey } from './daily-plan/daily-plan.state';
import { ITaskItemState, taskItem, taskItemKey } from './task-item/task-item.state';
import { IWatchBaseState, watchBase, watchBaseKey } from './watch-base/watch-base.state';

type StoreType = {
    [dialogKey]: IDialogState;
    [settingsKey]: ISettingsState;
    [soundKey]: ISoundState;
    [mainViewKey]: IMainViewState;
    [categoryKey]: ICategoryState;
    [dailyPlanKey]: IDailyPlanState;
    [taskItemKey]: ITaskItemState;
    [watchBaseKey]: IWatchBaseState;
};

export default createStore<StoreType>({
    modules: {
        [dialogKey]: dialog,
        [settingsKey]: settings,
        [soundKey]: sound,
        [mainViewKey]: mainView,
        [categoryKey]: category,
        [dailyPlanKey]: dailyPlan,
        [taskItemKey]: taskItem,
        [watchBaseKey]: watchBase
    }
});
