import { delay } from '@/utils/utils';

export default {
    namespace: 'article',
    state: {
        info: null,
        description: null,
        resources: null
    },
    effects: {
        *fetch({ payload }, { call, put }) {
            const { courseId, lectureId } = payload;
            yield delay(1200);
            yield put({
                type: 'saveInfo',
                payload: {
                    _id: lectureId,
                    title: 'Understand What Analytics data to Collect (Tip 1)',
                    estimaseTime: null,
                    createdAt: 1578813445900,
                    updatedAt: 1578813445900,
                    chapter: {
                        _id: 1,
                        title: 'The Vue Router'
                    },
                    content: null
                }
            })
        }
    },
    reducers: {
        saveInfo(state, { payload }) {
            return {
                ...state,
                info: { ...payload }
            };
        },
        reset() {
            return null;
        }
    }
}