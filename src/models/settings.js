import * as settingsService from '@/services/settings';

export default {
    namespace: 'settings',
    state: {
        areasMenu: null
    },
    effects: {
        *fetch(action, { call, put }) {
            const response = yield call(settingsService.fetchAreasMenu);
            if (response) {
                const menu = response.data;
                yield put({
                    type: 'save',
                    payload: {
                        areasMenu: menu
                    }
                });
            }  
        }
    },
    reducers: {
        save(state, { payload }) {
            return {
                ...state,
                ...payload
            };
        }
    }
}