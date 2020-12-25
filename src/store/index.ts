import { createStore } from 'vuex';

import { IWatchBaseState, watchBase } from './watch-base/watch-base.state';

export default createStore<{ watchBase: IWatchBaseState }>({
    modules: {
        watchBase
    }
});
