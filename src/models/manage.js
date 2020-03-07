import { delay } from '@/utils/utils';
import _ from 'lodash';
import router from 'umi/router';
import QUESTIONS from '@/assets/fakers/questions';
import LECTURE_OPTIONS from '@/assets/fakers/syllabus';
import THREAD from '@/assets/fakers/thread';
import ANSWERS from '@/assets/fakers/answers';

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
        *fetchThread({ payload }, { call, put }) {
            const { courseId, threadId } = payload;
            //call api with threadId, courseId --> check for thread belong course
            yield delay(1400);
            const status = 0;
            if (status === 0)
                yield put({
                    type: 'saveThread',
                    payload: THREAD
                });
            else router.replace('/error/404');
        },
        *moreAnswers({ payload: threadId }, { call, put, select }) {
            const { thread } = yield select(state => state.manage);
            const {
                answers
            } = thread;
            //more answers baseon threadId, answers
            yield delay(1200);
            yield put({
                type: 'pushAnswers',
                payload: {
                    hasMore: false,
                    data: ANSWERS
                }
            });
        },
        *toggleVote({ payload: threadId }, { call, put }) {
            yield put({
                type: 'toggleVoting'
            });
            yield delay(1000);
            //call api
        },
        *toggleFollow({ payload: threadId }, { call, put }) {
            yield put({
                type: 'toggleFollowing',
            });
            yield delay(800);
        },
        *toggleAnswerVote({ payload: answerId }, { call, put }) {
            yield put({
                type: 'toggleAnswerVoting',
                payload: answerId
            });
            yield delay(900);
        },
        *answer({ payload }, { call, put }) {
            const { threadId, answer } = payload;
            yield delay(1200);
            //call api with threadId, answer --> response --> answer
            const response = {
                data: {
                    _id: 'new_answer',
                    user: {
                        _id: 1,
                        avatar: 'https://scontent.fdad1-1.fna.fbcdn.net/v/t1.0-9/51059227_2091470127614437_5419405170205261824_o.jpg?_nc_cat=106&_nc_ohc=LnSzD5KUUN4AX8EolVa&_nc_ht=scontent.fdad1-1.fna&oh=95b1eba87a97f6266a625c07caf68566&oe=5EAE6D56',
                        name: 'HuYeFen Cute',
                        isInstructor: true
                    },
                    createdAt: 1578818445997,
                    content: answer,
                    numOfVotings: 0,
                    isVoted: false
                }
            };
            const {
                data: answerData
            } = response;
            yield put({
                type: 'shiftAnswer',
                payload: answerData
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
        },
        saveThread(state, { payload }) {
            return {
                ...state,
                thread: { ...payload }
            }
        },
        pushAnswers(state, { payload }) {
            const { hasMore, data } = payload;
            return {
                ...state,
                thread: {
                    ...state.thread,
                    moreAnswers: hasMore,
                    answers: [
                        ...state.thread.answers,
                        ...data
                    ]
                }
            };
        },
        shiftAnswer(state, { payload: answer }) {
            return {
                ...state,
                thread: {
                    ...state.thread,
                    totalAnswers: state.thread.totalAnswers + 1,
                    answers: [answer, ...state.thread.answers]
                }
            };
        },
        toggleVoting(state) {
            const numOfVotings = state.thread.isVoted ? state.thread.numOfVotings - 1 : state.thread.numOfVotings + 1;
            return {
                ...state,
                thread: {
                    ...state.thread,
                    numOfVotings,
                    isVoted: !state.thread.isVoted
                }
            };
        },
        toggleFollowing(state) {
            return {
                ...state,
                thread: {
                    ...state.thread,
                    isFollowed: !state.thread.isFollowed
                }
            };
        },
        toggleAnswerVoting(state, { payload: answerId }) {
            const answersData = [...state.thread.answers];
            const index = _.findIndex(answersData, ['_id', answerId]);
            if (answersData[index].isVoted) answersData[index].numOfVotings -= 1;
            else answersData[index].numOfVotings += 1;
            answersData[index].isVoted = !answersData[index].isVoted;
            return {
                ...state,
                thread: {
                    ...state.thread,
                    answers: [...answersData]
                }
            };
        },
        resetThread(state) {
            return { ...state, thread: null };
        },
    }
};