import { delay } from '@/utils/utils';
import _ from 'lodash';
import QUESTIONS from '@/assets/fakers/questions';
import LECTURE_OPTIONS from '@/assets/fakers/syllabus';

const initialState = {
    forum: {
        total: null,
        list: null,
        lectureOptions: null,
        hasMore: null,
        filters: {
            lecture: 'all',
            sortBy: "relevance",
            questionTypes: []
        }
    },
    thread: null,
};

export default {
    namespace: 'manage',
    state: initialState,
    effects: {
        *fetchQuestions({ payload: courseId }, { call, put }) {
            yield delay(2000);
            yield put({
                type: 'saveQuestions',
                payload: {
                    hasMore: true,
                    total: 4197,
                    data: QUESTIONS
                }
            });
        },
        *moreQuestions({ payload: courseId }, { call, put, select }) {
            const { forum } = yield select(state => state.manage);
            const {
                filters: {
                    sortBy,
                    lecture,
                    questionTypes
                },
                list
            } = forum;
            //base on list and filters values.
            yield delay(1500);
            yield put({
                type: 'pushQuestions',
                payload: {
                    hasMore: false,
                    data: QUESTIONS
                }
            });
        },
        *fetchLectureOpts({ payload: courseId }, { call, put }) {
            yield delay(1200);
            yield put({
                type: 'saveLectureOpts',
                payload: LECTURE_OPTIONS
            });
        },
        *sortQuestions({ payload }, { call, put, select }) {
            const { courseId, value } = payload;
            yield put({
                type: 'saveFilters',
                payload: {
                    type: 'sortBy',
                    value
                }
            });
            const { forum } = yield select(state => state.manage);
            const {
                filters: {
                    lecture,
                    questionTypes
                }
            } = forum;
            //sort with lecture, types and value == sortBy
            yield delay(1500);
            yield put({
                type: 'saveQuestions',
                payload: {
                    hasMore: true,
                    total: 2197,
                    data: QUESTIONS
                }
            });
        },
        *filterQuestionsByLecture({ payload }, { call, put, select }) {
            const { courseId, value } = payload;
            yield put({
                type: 'saveFilters',
                payload: {
                    type: 'lecture',
                    value
                }
            });
            const { forum } = yield select(state => state.manage);
            const {
                filters: {
                    sortBy,
                    questionTypes
                }
            } = forum;
            //sort with lecture, types and value == lecture
            yield delay(1500);
            yield put({
                type: 'saveQuestions',
                payload: {
                    hasMore: true,
                    total: 702,
                    data: QUESTIONS
                }
            });
        },
        *filterQuestionsByTypes({ payload }, { call, put, select }) {
            const { courseId, values } = payload;
            yield put({
                type: 'saveFilters',
                payload: {
                    type: 'questionTypes',
                    value: values
                }
            });
            const { forum } = yield select(state => state.manage);
            const {
                filters: {
                    sortBy,
                    lecture
                }
            } = forum;
            //sort with lecture, types and value == lecture
            yield delay(1500);
            yield put({
                type: 'saveQuestions',
                payload: {
                    hasMore: true,
                    total: 1643,
                    data: QUESTIONS
                }
            });
        },
    },
    reducers: {
        saveQuestions(state, { payload }) {
            const { hasMore, total, data } = payload;
            return {
                ...state,
                forum: {
                    ...state.forum,
                    total,
                    hasMore,
                    list: [...data]
                }
            };
        },
        pushQuestions(state, { payload }) {
            const { hasMore, data } = payload;
            return {
                ...state,
                forum: {
                    ...state.forum,
                    hasMore,
                    list: [...state.forum.list, ...data]
                }
            };
        },
        saveLectureOpts(state, { payload }) {
            return {
                ...state,
                forum: {
                    ...state.forum,
                    lectureOptions: [...payload]
                }
            };
        },
        saveFilters(state, { payload }) {
            const { type, value } = payload;
            return {
                ...state,
                forum: {
                    ...state.forum,
                    filters: {
                        ...state.forum.filters,
                        [type]: value
                    }
                }
            };
        },
        resetForum(state) {
            return {
                ...state,
                forum: {
                    total: null,
                    list: null,
                    lectureOptions: null,
                    hasMore: null,
                    filters: {
                        lectures: 'all',
                        sortBy: "recommend",
                        questionTypes: []
                    }
                }
            };
        }
    }
};