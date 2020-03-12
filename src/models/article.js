import { delay } from '@/utils/utils';
import RESOURCES from '@/assets/fakers/resources';

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
                    estimateHour: 0,
                    estimateMinute: 0,
                    createdAt: 1578813445900,
                    updatedAt: 1578813445900,
                    chapter: {
                        _id: 1,
                        title: 'The Vue Router'
                    },
                    content: null
                }
            })
        },
        *fetchDescription({ payload }, { call, put }) {
            const { courseId, lectureId } = payload;
            yield delay(1000);
            yield put({
                type: 'saveDescription',
                payload: ''
            });
        },
        *fetchResources({ payload }, { call, put }) {
            const { courseId, lectureId } = payload;
            yield delay(1200);
            yield put({
                type: 'saveResources',
                payload: RESOURCES
            })
        },
        *updateEstimateTime({ payload }, { call, put }) {
            const { hour, minute } = payload;
            yield delay(1200);
            yield put({
                type: 'saveEstimateTime',
                payload: {
                    hour,
                    minute
                }
            });
        },
        *updateDescription({ payload }, { call, put }) {
            const { lectureId, content } = payload;
            yield delay(1600);
            yield put({
                type: 'saveDescription',
                payload: content
            });
        }
    },
    reducers: {
        saveInfo(state, { payload }) {
            return {
                ...state,
                info: { ...payload }
            };
        },
        saveDescription(state, { payload }) {
            return {
                ...state,
                description: payload
            };
        },
        saveResources(state, { payload }) {
            return {
                ...state,
                resources: { ...payload }
            };
        },
        saveEstimateTime(state, { payload }) {
            const { hour, minute } = payload;
            return {
                ...state,
                info: {
                    ...state.info,
                    estimateMinute: minute,
                    estimateHour: hour
                }
            };
        },
        reset() {
            return {
                info: null,
                description: null,
                resources: null
            };
        }
    }
}