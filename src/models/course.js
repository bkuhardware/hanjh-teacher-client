import { delay } from '@/utils/utils';

export default {
    namespace: 'course',
    state: {
        info: null
    },
    effects: {
        *fetchInfo({ payload: courseId }, { call, put }) {
            yield delay(1600);
            yield put({
                type: 'saveInfo',
                payload: {
                    _id: courseId,
                    name: 'Build Web Apps with Vue JS 2 & Firebase',
                    privacy: 'public'
                }
            });
        },
        *validate({ payload }, { call, put }) {
            const {
                courseId,
                onOk,
                onInvalidCourse,
                onInvalidStudent
            } = payload;
            yield delay(1400);
            const validStatus = 0;
            if (validStatus === 0) onOk();
            else if (validStatus === 1) onInvalidCourse();
            else onInvalidStudent();
        }
    },
    reducers: {
        saveInfo(state, { payload }) {
            return {
                ...state,
                info: { ...payload }
            }
        },
        resetInfo(state) {
            return {
                ...state,
                info: null
            }
        }
    }
};