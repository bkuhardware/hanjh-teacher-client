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
        *fetchLectureOpts({ payload: courseId }, { call, put }) {
            yield delay(1200);
            yield put({
                type: 'saveLectureOpts',
                payload: LECTURE_OPTIONS
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
        saveLectureOpts(state, { payload }) {
            return {
                ...state,
                forum: {
                    ...state.forum,
                    lectureOptions: [...payload]
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