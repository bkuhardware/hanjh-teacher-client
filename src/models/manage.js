import { delay } from '@/utils/utils';
import _ from 'lodash';
import router from 'umi/router';
import * as questionService from '@/services/question';
import * as courseService from '@/services/course';
import QUESTIONS from '@/assets/fakers/questions';
import LECTURE_OPTIONS from '@/assets/fakers/syllabus';
import THREAD from '@/assets/fakers/thread';
import ANSWERS from '@/assets/fakers/answers';
import ANNOUNCEMENTS from '@/assets/fakers/announcements';
import OLD_ANNOUNCEMENTS from '@/assets/fakers/oldAnnouncements';
import COMMENTS from '@/assets/fakers/answers';
import REVIEWS from '@/assets/fakers/reviews';
import MEMBERS from '@/assets/fakers/members';

const REVIEW_THREAD = {
    _id: 1,
    user: {
        _id: 1,
        avatar: 'https://scontent-hkg3-1.xx.fbcdn.net/v/t1.0-9/79839947_1718251121650352_2705389046368043008_o.jpg?_nc_cat=105&_nc_sid=7aed08&_nc_oc=AQm7zCIn_YPMhC86cNk_CaXiy17-f29ngxaSeJ040H5LtHHhXOgXvAtkByLf8J9ukdU&_nc_ht=scontent-hkg3-1.xx&oh=fb33333e9bca6ccb7d23ca3ae103d82b&oe=5E8E59F1',
        name: 'Blog Wu'
    },
    
    status: 1,
    starRating: 3.5,
    createdAt: 1578813445999,
    answers: [
        {
            _id: 'answer_1',
            user: {
                _id: 'user_1',
                avatar: 'https://scontent.fsgn4-1.fna.fbcdn.net/v/t1.0-9/84152539_1771374896337974_6897420742380486656_n.jpg?_nc_cat=101&_nc_sid=110474&_nc_oc=AQnpMiaSVVyo6htdRXPLzg1vhHx7F4Z1PT70lL-9dL_oq-qth1IrVHgO8aHXuR3E8FE&_nc_ht=scontent.fsgn4-1.fna&oh=148a3f76188777cd0ad88885e24e33fc&oe=5E957113',
                name: 'Huyen Dang',
                isInstructor: true
            },
            content: 'While you might not truly exit the class as an intermediate hacker, you aren’t going to be a total novice after taking this class. In fact, despite being a Windows user for years, I now feel much more comfortable using the Linux Terminal interface over the Command Prompt',
            createdAt: 1578813445999
        },
        {
            _id: 'answer_2',
            user: {
                _id: 'user_1',
                avatar: 'https://scontent.fsgn4-1.fna.fbcdn.net/v/t1.0-9/84152539_1771374896337974_6897420742380486656_n.jpg?_nc_cat=101&_nc_sid=110474&_nc_oc=AQnpMiaSVVyo6htdRXPLzg1vhHx7F4Z1PT70lL-9dL_oq-qth1IrVHgO8aHXuR3E8FE&_nc_ht=scontent.fsgn4-1.fna&oh=148a3f76188777cd0ad88885e24e33fc&oe=5E957113',
                name: 'Huyen Dang',
                isInstructor: true
            },
            content: 'While you might not truly exit the class as an intermediate hacker, you aren’t going to be a total novice after taking this class. In fact, despite being a Windows user for years, I now feel much more comfortable using the Linux Terminal interface over the Command Prompt',
            createdAt: 1578813445999
        }
    ],
    content: 'Please tell us a video in advance if there is a tool to install in order to start the video within the same conditions. Most of the tools really took me some time to install. Or if possible, set a list of tools to install before the course. Else, the course was fantastic!!'
};

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
        list: null,
        permission: null
    },
    reviews: {
        hasMore: true,
        featured: null,
        list: null,
        permission: null
    },
    reviewThread: null,
    settings: {
        permission: null,
        members: null
    }
};

export default {
    namespace: 'manage',
    state: initialState,
    effects: {
        *fetchPermission({ payload }, { call, put }) {
            const { courseId, type } = payload;
            //call api with courseId, type, response return permission value
            let permission;
            if (type === 'announcements') permission = 1;
            else if (type === 'settings') permission = {
                privacy: 1,
                members: 2,
            };
            else if (type === 'reviews') permission = 0;
            yield delay(800);
            yield put({
                type: 'savePermission',
                payload: {
                    type,
                    value: permission
                }
            });
        },
        *fetchQuestions({ payload: courseId }, { call, put }) {
            const response = yield call(questionService.fetch, courseId, {
                sort: 'relevance',
                lecture: 'all',
                questionTypes: []
            });
            if (response) {
                const { hasMore, total, list } = response.data;
                yield put({
                    type: 'saveQuestions',
                    payload: {
                        hasMore,
                        total,
                        data: list
                    }
                });
            }
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
            const currentPage = _.size(list) / 12;
            const response = yield call(questionService.fetch, courseId, {
                sort: sortBy,
                lecture,
                questionTypes
            }, currentPage + 1);
            if (response) {
                const { hasMore, total, list } = response.data;
                yield put({
                    type: 'pushQuestions',
                    payload: {
                        hasMore,
                        total,
                        data: list
                    }
                });
            }
        },
        *fetchLectureOpts({ payload: courseId }, { call, put }) {
            const response = yield call(courseService.fetchChaptersDetail, courseId);
            if (response) {
                yield put({
                    type: 'saveLectureOpts',
                    payload: response.data
                });
            }
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
            const response = yield call(questionService.fetch, courseId, {
                lecture,
                sort: value,
                questionTypes
            });
            if (response) {
                const { hasMore, total, list } = response.data;
                yield put({
                    type: 'saveQuestions',
                    payload: {
                        hasMore,
                        total,
                        data: list
                    }
                });
            }
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
            const response = yield call(questionService.fetch, courseId, {
                lecture: value,
                sort: sortBy,
                questionTypes
            });
            if (response) {
                const { hasMore, total, list } = response.data;
                yield put({
                    type: 'saveQuestions',
                    payload: {
                        hasMore,
                        total,
                        data: list
                    }
                });
            }
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
            const response = yield call(questionService.fetch, courseId, {
                sort: sortBy,
                lecture,
                questionTypes: values
            });
            if (response) {
                const { hasMore, total, list } = response.data;
                yield put({
                    type: 'saveQuestions',
                    payload: {
                        hasMore,
                        total,
                        data: list
                    }
                });
            }
        },
        *fetchThread({ payload }, { call, put }) {
            const { courseId, threadId } = payload;
            const response = yield call(questionService.fetchThread, courseId, threadId);
            if (response) {
                yield put({
                    type: 'saveThread',
                    payload: response.data
                });
            }
        },
        *moreAnswers({ payload }, { call, put, select }) {
            const {
                courseId,
                threadId
            } = payload;
            const { thread } = yield select(state => state.manage);
            const {
                answers
            } = thread;
            const skip = _.size(answers);
            const response = yield call(questionService.fetchAnswers, courseId, threadId, skip);
            if (response) {
                const { hasMore, list } = response.data;
                yield put({
                    type: 'pushAnswers',
                    payload: {
                        hasMore,
                        data: list
                    }
                });
            }
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
        *moreComments({ payload }, { call, put, select }) {
            const {
                announcementId,
                courseId
            } = payload;
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
        *addAnnouncement({ payload }, { call, put }) {
            const { courseId, content, callback } = payload;
            yield delay(1200);
            //call api with courseId, content
            yield put({
                type: 'shiftAnnouncement',
                payload: {
                    _id: _.uniqueId('announce_'),
                    user: {
                        _id: 1,
                        name: 'Ngoc Hanh Vuong',
                        avatar: 'https://scontent.fdad2-1.fna.fbcdn.net/v/t1.0-0/p640x640/42792810_1917076911720427_2309321533291495424_o.jpg?_nc_cat=110&_nc_ohc=GAtqnLxcynIAX8VZhpo&_nc_ht=scontent.fdad2-1.fna&_nc_tp=1002&oh=67837b802b62d8b1fb6423a3dc393017&oe=5E9B0CF0'
                    },
                    createdAt: Date.now(),
                    moreComments: false,
                    commentsLoading: false,
                    content,
                    comments: []
                }
            });
            if (callback) callback();
        },
        
        *fetchReviews({ payload: courseId }, { call, put }) {
            yield delay(1500);
            yield put({
                type: 'saveReviews',
                payload: {
                    ...REVIEWS,
                    hasMore: true
                }
            });
        },
        *moreReviews({ payload: courseId }, { call, put }) {
            yield delay(1200);
            yield put({
                type: 'pushReviews',
                payload: {
                    hasMore: false,
                    data: REVIEWS.list
                }
            });
        },
        *voteReview({ payload }, { call, put }) {
            const {
                type,
                reviewId,
                value,
                oldValue
            } = payload;
            yield put({
                type: 'saveReviewVote',
                payload: {
                    type,
                    reviewId,
                    value
                }
            });
            yield delay(1000);
        },
        *fetchMembers({ payload: courseId }, { call, put }) {
            yield delay(1800);
            yield put({
                type: 'saveMembers',
                payload: MEMBERS
            });
        },
        *updatePrivacy({ payload }, { call, put }) {
            const { 
                courseId,
                value,
                password,
                callback
            } = payload;
            //call api with courseId, value, password
            if (password) {
                yield delay(1200);
                //call api with type = 'password', password
            }
            else yield delay(1500);     //call api with only type.
            yield put({
                type: 'course/savePrivacy',
                payload: value
            });
            if (callback) callback();
        },
        *updateMembers({ payload }, { call, put }) {
            const { courseId, data } = payload;
            yield delay(1600);
            //call api with courseId, data
            const keys = _.keys(data);
            const returnData = _.map(keys, key => ({
                _id: key,
                permission: { ...data[key] }
            }));
            yield put({
                type: 'saveMembers',
                payload: _.map(returnData, (member, i) => ({
                    ...member,
                    avatar: null,
                    name: 'Dang Thuy Huyen',
                    isOwner: i === 0
                }))
            });
        },
        *addMember({ payload }, { call, put }) {
            const { courseId, email, callback } = payload;
            yield delay(1200);
            if (callback) callback();
        },
        *fetchReviewThread({ payload }, { call, put }) {
            const { courseId, threadId } = payload;
            yield delay(1600);
            yield put({
                type: 'saveReviewThread',
                payload: REVIEW_THREAD
            });
        },
        *answerReview({ payload }, { call, put }) {
            const { reviewId, answer, callback } = payload;
            yield delay(1200);
            yield put({
                type: 'shiftReviewAnswer',
                payload: {
                    _id: `new_answer ${_.uniqueId('sndsdf')}`,
                    user: {
                        _id: 1,
                        avatar: 'https://scontent.fdad1-1.fna.fbcdn.net/v/t1.0-9/51059227_2091470127614437_5419405170205261824_o.jpg?_nc_cat=106&_nc_ohc=LnSzD5KUUN4AX8EolVa&_nc_ht=scontent.fdad1-1.fna&oh=95b1eba87a97f6266a625c07caf68566&oe=5EAE6D56',
                        name: 'HuYeFen Cute',
                        isInstructor: true
                    },
                    createdAt: Date.now(),
                    content: answer
                }
            });
            if (callback) callback();
        }
    },
    reducers: {
        savePermission(state, { payload }) {
            const { type, value } = payload;
            return {
                ...state,
                [type]: {
                    ...state[type],
                    permission: value
                }
            };
        },
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
                    ...state.announcements,
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
                    ...state.announcements,
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
        shiftAnnouncement(state, { payload: announce }) {
            return {
                ...state,
                announcements: {
                    ...state.announcements,
                    list: {
                        ...state.announcements.list,
                        [announce._id]: announce
                    }
                }
            }
        },
        resetAnnouncements(state) {
            return {
                ...state,
                announcements: {
                    hasMore: true,
                    list: null,
                    permission: null
                }
            };
        },
        saveReviews(state, { payload }) {
            return {
                ...state,
                reviews: {
                    ...state.reviews,
                    ...payload
                }
            };
        },
        pushReviews(state, { payload }) {
            const { hasMore, data } = payload;
            return {
                ...state,
                reviews: {
                    ...state.reviews,
                    hasMore,
                    list: [
                        ...state.reviews.list,
                        ...data
                    ]
                }
            };
        },
        saveReviewVote(state, { payload }) {
            const { 
                type,
                reviewId,
                value
            } = payload;
            const attr = type === 'default' ? 'list' : 'featured';
            const list = [...state.reviews[attr]];
            const index = _.findIndex(list, ['_id', reviewId]);
            list[index].status = value;
            return {
                ...state,
                reviews: {
                    ...state.reviews,
                    [attr]: [...list]
                }
            }
        },
        resetReviews(state) {
            return {
                ...state,
                reviews: {
                    hasMore: true,
                    list: null,
                    featured: null,
                    permission: null
                }
            }
        },
        saveReviewThread(state, { payload }) {
            return {
                ...state,
                reviewThread: { ...payload }
            };
        },
        shiftReviewAnswer(state, { payload: answer }) {
            return {
                ...state,
                reviewThread: {
                    ...state.reviewThread,
                    answers: [
                        answer,
                        ...state.reviewThread.answers
                    ]
                }
            };
        },
        resetReviewThread(state) {
            return {
                ...state,
                reviewThread: null
            };
        },
        saveMembers(state, { payload }) {
            return {
                ...state,
                settings: {
                    ...state.settings,
                    members: [...payload]
                }
            };
        },
        resetSettings(state) {
            return {
                ...state,
                settings: {
                    members: null,
                    permission: null
                }
            };
        }
    }
};