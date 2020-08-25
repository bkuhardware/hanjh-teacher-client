import { delay } from '@/utils/utils';
import _ from 'lodash';
import COURSES from '@/assets/fakers/courses';
import * as courseService from '@/services/course';
import router from 'umi/router';

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
            const response = yield call(courseService.fetch, 'newest');
            if (response) {
                const { total, list } = response.data;
                yield put({
                    type: 'save',
                    payload: {
                        total,
                        list,
                        sortBy: 'newest',
                        currentPage: 1
                    }
                });
            }
        },
        *sort({ payload: sortBy }, { call, put }) {
            //call api with sortBy and page = 1
            const response = yield call(courseService.fetch, sortBy);
            if (response) {
                const { total, list } = response.data;
                yield put({
                    type: 'save',
                    payload: {
                        total,
                        list,
                        sortBy,
                        currentPage: 1
                    }
                });
            }
        },
        *page({ payload: pageVal }, { call, put, select }) {
            const { sortBy } = yield select(state => state.courses);
            const response = yield call(courseService.fetch, sortBy, pageVal);
            if (response) {
                const { total, list } = response.data;
                yield put({
                    type: 'save',
                    payload: {
                        total,
                        list,
                        sortBy,
                        currentPage: pageVal
                    }
                });
            }
        },
        *create({ payload }, { call, put }) {
            const { title, area, callback } = payload;
            const response = yield call(courseService.create, title, area);
            if (response) {
                const courseId = response.data._id;
                if (callback) callback();
                router.push(`/course/${courseId}/edit/goals`);
            }
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