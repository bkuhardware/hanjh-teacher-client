import { delay } from '@/utils/utils';
import _ from 'lodash';
import COURSE_INFO from '@/assets/fakers/courseInfo';
import GOALS from '@/assets/fakers/goals';
import LANDING from '@/assets/fakers/landing';
import MESSAGES from '@/assets/fakers/messages';
import HISTORY from '@/assets/fakers/history';

const FOO = [
    {
        _id: 'what_learn_1',
        content: 'tình yêu là ánh sáng, đến xua đi mịt mờ mấy đêm',
        owner: {
            //last owner
            _id: 1,
            name: 'Thuy Huyen',
            avatar: 'https://scontent.fsgn5-2.fna.fbcdn.net/v/t1.0-1/83644753_1765496750259122_7261950568300544000_n.jpg?_nc_cat=105&_nc_oc=AQl7P3ybDMEUjJF6QEXVNp8UrrWIa57YPrTPfWqVDNFlBf7cCmOyX7Re115oUGS88EA&_nc_ht=scontent.fsgn5-2.fna&oh=cb09c64994cffa8ab83c09f0e199440a&oe=5EC33792'
        },
        updatedAt: 1582426452944,
        editable: false
    },
    {
        _id: 'what_learn_2',
        content: 'Làm gì cũng phải nghĩ đến cả 2 đứa',
        owner: {
            //last owner
            _id: 1,
            name: 'Thuý Huyền',
            avatar: 'https://scontent.fsgn5-2.fna.fbcdn.net/v/t1.0-1/83644753_1765496750259122_7261950568300544000_n.jpg?_nc_cat=105&_nc_oc=AQl7P3ybDMEUjJF6QEXVNp8UrrWIa57YPrTPfWqVDNFlBf7cCmOyX7Re115oUGS88EA&_nc_ht=scontent.fsgn5-2.fna&oh=cb09c64994cffa8ab83c09f0e199440a&oe=5EC33792'
        },
        updatedAt: 1582426452844,
        editable: true
    },
    {
        _id: 'what_learn_3',
        content: 'Learn about & implement Firebase authentication into Vue JS web apps',
        owner: {
            //last owner
            _id: 1,
            name: 'Thuy Huyen',
            avatar: 'https://scontent.fsgn5-2.fna.fbcdn.net/v/t1.0-1/83644753_1765496750259122_7261950568300544000_n.jpg?_nc_cat=105&_nc_oc=AQl7P3ybDMEUjJF6QEXVNp8UrrWIa57YPrTPfWqVDNFlBf7cCmOyX7Re115oUGS88EA&_nc_ht=scontent.fsgn5-2.fna&oh=cb09c64994cffa8ab83c09f0e199440a&oe=5EC33792'
        },
        updatedAt: 1567476499584,
        editable: false
    },
    {
        _id: 'what_learn_4',
        content: 'Luân yêu Huyền!',
        owner: {
            //last owner
            _id: 1,
            name: 'Thuy Huyen',
            avatar: 'https://scontent.fsgn5-2.fna.fbcdn.net/v/t1.0-1/83644753_1765496750259122_7261950568300544000_n.jpg?_nc_cat=105&_nc_oc=AQl7P3ybDMEUjJF6QEXVNp8UrrWIa57YPrTPfWqVDNFlBf7cCmOyX7Re115oUGS88EA&_nc_ht=scontent.fsgn5-2.fna&oh=cb09c64994cffa8ab83c09f0e199440a&oe=5EC33792'
        },
        updatedAt: 1567476499584,
        editable: false
    },
    {
        _id: 'what_learn_5',
        content: 'Understand how using frameworks like Django will save you a ton of time in web development',
        owner: {
            //last owner
            _id: 2,
            name: 'Trong Luan',
            avatar: 'https://scontent.fsgn5-2.fna.fbcdn.net/v/t1.0-9/83558548_2290286491264377_331290296627232768_n.jpg?_nc_cat=107&_nc_oc=AQnpLi8nWGbC-08nBlYjhCuZyGVkcZMFHaqWTcBFbEZK1GzrkY73FWhSwonUwq-m0aE&_nc_ht=scontent.fsgn5-2.fna&oh=84246739e4ba3279ce49566f8f59bb01&oe=5EC49D12'
        },
        updatedAt: 1567476499584,
        editable: true
    },
    {
        _id: 'what_learn_6',
        content: 'Huyen love Luan',
        owner: {
            //last owner
            _id: 1,
            name: 'Thuy Huyen',
            avatar: 'https://scontent.fsgn5-2.fna.fbcdn.net/v/t1.0-1/83644753_1765496750259122_7261950568300544000_n.jpg?_nc_cat=105&_nc_oc=AQl7P3ybDMEUjJF6QEXVNp8UrrWIa57YPrTPfWqVDNFlBf7cCmOyX7Re115oUGS88EA&_nc_ht=scontent.fsgn5-2.fna&oh=cb09c64994cffa8ab83c09f0e199440a&oe=5EC33792'
        },
        updatedAt: 1567476499584,
        editable: true
    },
    {
        _id: 'what_learn_7',
        content: 'Luân miss Huyền!',
        owner: {
            //last owner
            _id: 1,
            name: 'Thuy Huyen',
            avatar: 'https://scontent.fsgn5-2.fna.fbcdn.net/v/t1.0-1/83644753_1765496750259122_7261950568300544000_n.jpg?_nc_cat=105&_nc_oc=AQl7P3ybDMEUjJF6QEXVNp8UrrWIa57YPrTPfWqVDNFlBf7cCmOyX7Re115oUGS88EA&_nc_ht=scontent.fsgn5-2.fna&oh=cb09c64994cffa8ab83c09f0e199440a&oe=5EC33792'
        },
        updatedAt: 1567476499584,
        editable: false
    },
];

const initialState = {
    info: null,
    history: {
        list: null,
        hasMore: true
    },
    goals: {
        whatLearn: null,
        requirements: null,
        targetStudents: null
    },
    landing: null,
    price: null,
    messages: null
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
        *fetchHistory({ payload: courseId }, { call, put }) {
            yield delay(1500);
            yield put({
                type: 'saveHistory',
                payload: {
                    data: HISTORY,
                    hasMore: true
                }
            });
        },
        *moreHistory({ payload: courseId }, { call, put, select }) {
            yield delay(5000);
            yield put({
                type: 'pushHistory',
                payload: {
                    data: HISTORY,
                    hasMore: false
                }
            });
        },
        *seenHistory({ payload: historyId }, { call, put, select }) {
            //const { info: { noOfUnseen } } = yield select(state => state.course);
            yield put({
                type: 'seenHistoryItem',
                payload: historyId
            });
            yield put({
                type: 'decreNoOfUnseen'
            });
            yield delay(1200);
            //call api with historyId
        },
        *allSeenHistory({ payload: courseId }, { call, put }) {
            yield delay(1200);
            //if ok --> put, else do nothing,
            //if ok -> get noOfUnseen
            yield put({
                type: 'allSeenHistoryItems',
                payload: {
                    noOfUnseen: 0
                }
            });
        },
        *fetchGoals({ payload: courseId }, { call, put }) {
            yield delay(2000);
            yield put({
                type: 'saveGoals',
                payload: GOALS
            });
        },
        *changeWhatLearn({ payload }, { call, put }) {
            const { courseId, change } = payload;
            yield delay(1500);
            //only call api, update by emit message, not by response.
        },
        *changeRequirements({ payload }, { call, put }) {
            const { courseId, change } = payload;
            yield delay(1400);
            //only call api, update by emit message, not by response.
        },
        *changeTargetStudents({ payload }, { call, put }) {
            const { courseId, change } = payload;
            yield delay(1200);
            //only call api, update by emit message, not by response.
        },
        *fetchLanding({ payload: courseId }, { call, put }) {
            yield delay(1500);
            yield put({
                type: 'saveLanding',
                payload: LANDING
            });
        },
        *changeBasicInfo({ payload }, { call, put }) {
            yield delay(1600);
            //call api with params in payload;
            yield put({
                type: 'pushLanding',
                payload: { ...payload }
            });
            //get Landing complete status in response. yield put for update status
            yield put({
                type: 'saveCompleteStatus',
                payload: {
                    type: 'landing',
                    status: true
                }
            });
        },
        *changeAvatar({ payload }, { call, put }) {
            const { file, callback } = payload;
            //call cloud api for upload avatar
            yield delay(1000);
            //after upload, get image url, call next api for change avatar for course
            //get response with object with avatar field: url of avatar. and complete status
            yield delay(1200);
            yield put({
                type: 'pushLanding',
                payload: {
                    avatar: file
                }
            });
            yield put({
                type: 'saveCompleteStatus',
                payload: {
                    type: 'landing',
                    status: false
                }
            });
            if (callback) callback();
        },
        *fetchPrice({ payload: courseId }, { call, put }) {
            yield delay(800);
            yield put({
                type: 'savePrice',
                payload: 'tier1'
            });
        },
        *changePrice({ payload }, { call, put }) {
            const { courseId, value } = payload;
            yield delay(1200);
            yield put({
                type: 'savePrice',
                payload: value
            });
            yield put({
                type: 'saveCompleteStatus',
                payload: {
                    type: 'price',
                    status: true
                }
            });
        },
        *fetchMessages({ payload: courseId }, { call, put }) {
            yield delay(1200);
            yield put({
                type: 'saveMessages',
                payload: MESSAGES
            });
        },
        *changeMessages({ payload }, { call, put }) {
            const {
                courseId,
                welcome,
                congratulation
            } = payload;
            yield delay(1500);
            yield put({
                type: 'saveMessages',
                payload: {
                    welcome,
                    congratulation
                }
            });
            yield put({
                type: 'saveCompleteStatus',
                payload: {
                    type: 'messages',
                    status: true
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
        saveCompleteStatus(state, { payload }) {
            const { type, status } = payload;
            return {
                ...state,
                info: {
                    ...state.info,
                    completeStatus: {
                        ...state.info.completeStatus,
                        [type]: status
                    }
                }
            };
        },
        resetInfo(state) {
            return {
                ...state,
                info: null
            }
        },
        saveHistory(state, { payload }) { 
            const { data, hasMore } = payload;
            return {
                ...state,
                history: {
                    list: data,
                    hasMore
                }
            };
        },
        pushHistory(state, { payload }) {
            const { data, hasMore } = payload;
            return {
                ...state,
                history: {
                    list: [...state.history.list, ...data],
                    hasMore
                }
            };
        },
        seenHistoryItem(state, { payload: historyId }) {
            const historyData = [...state.history.list];
            const index = _.findIndex(historyData, ['_id', historyId]);
            if (index > -1) historyData[index].seen = true;
            return {
                ...state,
                history: {
                    ...state.history,
                    list: [...historyData]
                }
            };
        },
        allSeenHistoryItems(state, { payload }) {
            const { noOfUnseen } = payload;
            return {
                ...state,
                info: {
                    ...state.info,
                    noOfUnseen
                },
                history: {
                    ...state.history,
                    list: _.map(state.history.list, history => ({
                        ...history,
                        seen: true
                    }))
                }
            }
        },
        decreNoOfUnseen(state) {
            return {
                ...state,
                info: {
                    ...state.info,
                    noOfUnseen: state.info.noOfUnseen - 1
                }
            };
        },
        resetHistory(state) {
            return {
                ...state,
                history: {
                    list: null,
                    hasMore: true
                }
            };
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
        },
        saveLanding(state, { payload }) {
            return {
                ...state,
                landing: { ...payload }
            };
        },
        pushLanding(state, { payload }) {
            return {
                ...state,
                landing: {
                    ...state.landing,
                    ...payload
                }
            };
        },
        resetLanding(state) {
            return {
                ...state,
                landing: null
            };
        },
        savePrice(state, { payload }) {
            return {
                ...state,
                price: payload
            };
        },
        resetPrice(state) {
            return {
                ...state,
                price: null
            };
        },
        saveMessages(state, { payload }) {
            return {
                ...state,
                messages: payload
            };
        },
        resetMessages(state) {
            return {
                ...state,
                messages: null
            };
        },
    }
};