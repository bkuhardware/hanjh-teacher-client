import { delay } from '@/utils/utils';
import _ from 'lodash';
import COURSES from '@/assets/fakers/courses';

export default {
    namespace: 'courses',
    state: {
        total: null,
        currentPage: 1,
        sortBy: 'newest',
        list: null
    },
    effects: {
        *fetch(action, { call, put }) {
            yield delay(1500);
            //call api with sort newest, page = 1.
            yield put({
                type: 'save',
                payload: {
                    total: 42,
                    currentPage: 1,
                    sortBy: 'newest',
                    list: COURSES
                }
            });
        },
        *sort({ payload: sortBy }, { call, put }) {
            //call api with sortBy and page = 1
            yield delay(1600);
            yield put({
                type: 'save',
                payload: {
                    total: 42,
                    currentPage: 1,
                    sortBy,
                    list: _.shuffle(COURSES)
                }
            });
        },
        *page({ payload: pageVal }, { call, put, select }) {
            const { sortBy } = yield select(state => state.courses);
            yield delay(1500);
            yield put({
                type: 'save',
                payload: {
                    currentPage: pageVal,
                    total: 42,
                    sortBy,
                    list: _.shuffle(COURSES)
                }
            })
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