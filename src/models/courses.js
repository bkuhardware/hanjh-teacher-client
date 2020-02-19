import { delay } from '@/utils/utils';

export default {
    namespace: 'courses',
    state: {
        hasMore: true,
        sortBy: 'newest',
        list: null
    },
    effects: {
        *fetch(action, { call, put }) {
            yield delay(1500);
            yield put({
                type: 'save',
                payload: {
                    hasMore: true,
                    list: []
                }
            });
        }
    },
    reducers: {
        save(state, { payload }) {
            return {
                ...state,
                ...payload
            };
        },
        reset() {
            return {
                hasMore: true,
                sortBy: 'newest',
                list: null
            };
        }
    }
}