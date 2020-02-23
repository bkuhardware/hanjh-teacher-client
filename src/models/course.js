import { delay } from '@/utils/utils';
import COURSE_INFO from '@/assets/fakers/courseInfo';
import GOALS from '@/assets/fakers/goals';

const initialState = {
    info: null,
    goals: {
        whatLearn: null,
        requirements: null,
        targetStudents: null
    }
};

export default {
    namespace: 'course',
    state: initialState,
    effects: {
        *fetchInfo({ payload: courseId }, { call, put }) {
            yield delay(1600);
            yield put({
                type: 'saveInfo',
                payload: COURSE_INFO
            });
        },
        *fetchGoals({ payload: courseId }, { call, put }) {
            yield delay(2000);
            yield put({
                type: 'saveGoals',
                payload: GOALS
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
        },
        saveGoals(state, { payload }) {
            return {
                ...state,
                goals: { ...payload }
            };
        },
        resetGoals(state) {
            return {
                ...state,
                goals: {
                    whatLearn: null,
                    requirements: null,
                    targetStudents: null
                }
            };
        }
    }
};