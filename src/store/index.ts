import { createStore } from 'vuex';

import { IWatchBaseState, watchBase, watchBaseKey } from './watch-base/watch-base.state';

type StoreType = {
    watchBase: IWatchBaseState;
};

export default createStore<StoreType>({
    modules: {
        [watchBaseKey]: watchBase
    }
});
