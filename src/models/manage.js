import { delay } from '@/utils/utils';
import _ from 'lodash';
import router from 'umi/router';
import QUESTIONS from '@/assets/fakers/questions';
import LECTURE_OPTIONS from '@/assets/fakers/syllabus';
import THREAD from '@/assets/fakers/thread';
import ANSWERS from '@/assets/fakers/answers';
import ANNOUNCEMENTS from '@/assets/fakers/announcements';
import OLD_ANNOUNCEMENTS from '@/assets/fakers/oldAnnouncements';
import COMMENTS from '@/assets/fakers/answers';

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
    announcements: {
        hasMore: true,
        list: null
    }
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
                    _id: `new_answer ${_.uniqueId('sndsdf')}`,
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
        *fetchAnnouncements({ payload: courseId }, { call, put }) {
            yield delay(1500);
            yield put({
                type: 'saveAnnouncements',
                payload: {
                    hasMore: true,
                    data: ANNOUNCEMENTS
                }
            })
        },
        *moreAnnouncements({ payload: courseId }, { call, put, select }) {
            const { announcements: { list } } = yield select(state => state.manage);
            yield delay(1200);
            yield put({
                type: 'pushAnnouncements',
                payload: {
                    hasMore: false,
                    data: OLD_ANNOUNCEMENTS
                }
            });
        },
        *moreComments({ payload: announcementId }, { call, put, select }) {
            yield put({
                type: 'saveCommentsLoading',
                payload: {
                    announcementId,
                    value: true
                }
            });
            const { announcements } = yield select(state => state.manage);
            const comments = announcements.list[announcementId].comments;
            //
            yield delay(1200);
            yield put({
                type: 'pushComments',
                payload: {
                    announcementId,
                    hasMore: false,
                    data: COMMENTS
                }
            })
            yield put({
                type: 'saveCommentsLoading',
                payload: {
                    announcementId,
                    value: false
                }
            });
        },
        *comment({ payload }, { call, put }) {
            const { announcementId, content } = payload;
            yield delay(1900);
            yield put({
                type: 'shiftComment',
                payload: {
                    data: {
                        _id: 'new',
                        user: {
                            _id: 1,
                            avatar: 'https://scontent.fdad1-1.fna.fbcdn.net/v/t1.0-9/52607910_2117264761701640_9035195513728663552_o.jpg?_nc_cat=102&_nc_ohc=_tJCZ8LLC10AX-zKJMI&_nc_ht=scontent.fdad1-1.fna&oh=52df2a0b6310de771d0888f065dc6837&oe=5EBD3DB8',
                            name: 'My love',
                            isInstructor: false
                        },
                        createdAt: 1578813445900,
                        content
                    },
                    announcementId
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
        saveAnnouncements(state, { payload }) {
            const { hasMore, data } = payload;
            return {
                ...state,
                announcements: {
                    hasMore,
                    list: { ...data }
                }
            };
        },
        pushAnnouncements(state, { payload }) {
            const { hasMore, data } = payload;
            return {
                ...state,
                announcements: {
                    hasMore,
                    list: {
                        ...state.announcements.list,
                        ...data
                    }
                }
            };
        },
        shiftComment(state, { payload }) {
            const { data, announcementId } = payload;
            console.log(announcementId);
            return {
                ...state,
                announcements: {
                    ...state.announcements,
                    list: {
                        ...state.announcements.list,
                        [announcementId]: {
                            ...state.announcements.list[announcementId],
                            comments: [
                                { ...data },
                                ...state.announcements.list[announcementId].comments
                            ]
                        }
                    }
                }
            }
        },
        pushComments(state, { payload }) {
            const { hasMore, data, announcementId } = payload;
            return {
                ...state,
                announcements: {
                    ...state.announcements,
                    list: {
                        ...state.announcements.list,
                        [announcementId]: {
                            ...state.announcements.list[announcementId],
                            moreComments: hasMore,
                            comments: [
                                ...state.announcements.list[announcementId].comments,
                                ...data
                            ]
                        }
                    }
                }
            }
        },
        saveCommentsLoading(state, { payload }) {
            const { announcementId, value } = payload;
            return {
                ...state,
                announcements: {
                    ...state.announcements,
                    list: {
                        ...state.announcements.list,
                        [announcementId]: {
                            ...state.announcements.list[announcementId],
                            commentsLoading: value
                        }
                    }
                }
            };
        },
        resetAnnouncements(state) {
            return {
                ...state,
                announcements: {
                    hasMore: true,
                    list: null
                }
            };
        },
    }
};