import { createStore } from 'vuex';

import { IMainViewState, mainView, mainViewKey } from './main-view/main-view.state';
import { IWatchBaseState, watchBase, watchBaseKey } from './watch-base/watch-base.state';

type StoreType = {
    [mainViewKey]: IMainViewState
    [watchBaseKey]: IWatchBaseState;
};

export default createStore<StoreType>({
    modules: {
        [mainViewKey]: mainView,
        [watchBaseKey]: watchBase
    }
});
