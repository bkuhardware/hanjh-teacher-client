import { delay } from '@/utils/utils';
import _ from 'lodash';
import * as courseService from '@/services/course';
import COURSE_INFO from '@/assets/fakers/courseInfo';
import GOALS from '@/assets/fakers/goals';
import LANDING from '@/assets/fakers/landing';
import MESSAGES from '@/assets/fakers/messages';
import HISTORY from '@/assets/fakers/history';
import SYLLABUS from '@/assets/fakers/syllabus';

const NEW_CHAPTER = {
    _id: 'chapter-X',
    title: 'Introduction',
    owner: {
        //last owner
        _id: 1,
        name: 'Thuy Huyen',
        avatar: 'https://scontent.fsgn5-2.fna.fbcdn.net/v/t1.0-1/83644753_1765496750259122_7261950568300544000_n.jpg?_nc_cat=105&_nc_oc=AQl7P3ybDMEUjJF6QEXVNp8UrrWIa57YPrTPfWqVDNFlBf7cCmOyX7Re115oUGS88EA&_nc_ht=scontent.fsgn5-2.fna&oh=cb09c64994cffa8ab83c09f0e199440a&oe=5EC33792'
    },
    updatedAt: Date.now(),
    lectures: []
};

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
        whatLearns: null,
        requirements: null,
        targetStudents: null
    },
    syllabus: null,
    landing: null,
    price: null,
    messages: null,
};

export default {
    namespace: 'course',
    state: initialState,
    effects: {
        *fetchInfo({ payload: courseId }, { call, put }) {
            const response = yield call(courseService.fetchInfo, courseId);
            if (response) {
                const courseInfo = response.data;
                yield put({
                    type: 'saveInfo',
                    payload: courseInfo
                });
            }
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
            const response = yield call(courseService.fetchGoals, courseId);
            if (response) {
                const goals = response.data;
                yield put({
                    type: 'saveGoals',
                    payload: goals
                });
            }
        },
        *changeWhatLearns({ payload }, { call, put }) {
            const {
                courseId,
                change
            } = payload;
            const response = yield call(courseService.updateWhatLearns, courseId, change);
            if (response) {
                const {
                    data: {
                        progress,
                        data: updatedData
                    }
                } = response;
                yield put({
                    type: 'saveCompleteStatus',
                    payload: {
                        type: 'goals',
                        status: progress === 100
                    }
                });
                yield put({
                    type: 'updateGoals',
                    payload: {
                        type: 'whatLearns',
                        data: updatedData
                    }
                });
            }
        },
        *changeRequirements({ payload }, { call, put }) {
            const {
                courseId,
                change
            } = payload;
            const response = yield call(courseService.updateRequirements, courseId, change);
            if (response) {
                const {
                    data: {
                        progress,
                        data: updatedData
                    }
                } = response;
                yield put({
                    type: 'saveCompleteStatus',
                    payload: {
                        type: 'goals',
                        status: progress === 100
                    }
                });
                yield put({
                    type: 'updateGoals',
                    payload: {
                        type: 'requirements',
                        data: updatedData
                    }
                });
            }
        },
        *changeTargetStudents({ payload }, { call, put }) {
            const {
                courseId,
                change
            } = payload;
            const response = yield call(courseService.updateTargetStudents, courseId, change);
            if (response) {
                const {
                    data: {
                        progress,
                        data: updatedData
                    }
                } = response;
                yield put({
                    type: 'saveCompleteStatus',
                    payload: {
                        type: 'goals',
                        status: progress === 100
                    }
                });
                yield put({
                    type: 'updateGoals',
                    payload: {
                        type: 'targetStudents',
                        data: updatedData
                    }
                });
            }
        },
        *fetchSyllabus({ payload: courseId }, { call, put }) {
            const response = yield call(courseService.fetchSyllabus, courseId);
            if (response) {
                const syllabus = response.data;
                yield put({
                    type: 'saveSyllabus',
                    payload: syllabus
                });
            }
        },
        *addChapter({ payload }, { call, put }) {
            const { courseId, title, description, callback } = payload;
            const response = yield call(courseService.addChapter, courseId, title, description);
            if (response) {
                const {
                    progress,
                    data: newChapter
                } = response.data;
                yield put({
                    type: 'pushChapter',
                    payload: newChapter
                });
                yield put({
                    type: 'pushChapterInCourseInfo',
                    payload: _.pick(newChapter, ['_id', 'lectures', 'title'])
                });
                yield put({
                    type: 'saveCompleteStatus',
                    payload: {
                        type: 'syllabus',
                        status: progress === 100
                    }
                });
                if (callback) callback();
            }
        },
        *updateChapter({ payload }, { call, put }) {
            const { courseId, chapterId, title, description, callback } = payload;
            const response = yield call(courseService.updateChapter, courseId, chapterId, title, description);
            if (response) {
                const newChapter = response.data;
                yield put({
                    type: 'changeChapter',
                    payload: newChapter
                });
                yield put({
                    type: 'changeChapterInCourseInfo',
                    payload: {
                        _id: chapterId,
                        title
                    }
                });
                if (callback) callback();
            }
        },
        *deleteChapter({ payload }, { call, put }) {
            const { courseId, chapterId } = payload;
            yield delay(1500);
            yield put({
                type: 'removeChapter',
                payload: chapterId
            });
            yield put({
                type: 'removeChapterInCourseInfo',
                payload: chapterId
            });
        },
        *addLecture({ payload }, { call, put }) {
            const {
                courseId,
                chapterId,
                title,
                type,
                callback
            } = payload;
            yield delay(1600);
            //call api, response return new lecture, complete Status,
            yield put({
                type: 'pushLecture',
                payload: {
                    chapterId,
                    lecture: {
                        _id: _.uniqueId('lecture_'),
                        title,
                        type,
                        owner: {
                            //last owner
                            _id: 2,
                            name: 'Trong Luan',
                            avatar: 'https://scontent.fsgn5-2.fna.fbcdn.net/v/t1.0-9/83558548_2290286491264377_331290296627232768_n.jpg?_nc_cat=107&_nc_oc=AQnpLi8nWGbC-08nBlYjhCuZyGVkcZMFHaqWTcBFbEZK1GzrkY73FWhSwonUwq-m0aE&_nc_ht=scontent.fsgn5-2.fna&oh=84246739e4ba3279ce49566f8f59bb01&oe=5EC49D12'
                        },
                        updatedAt: Date.now(),
                    }
                }
            });
            yield put({
                type: 'pushLectureInCourseInfo',
                payload: {
                    lecture: {
                        _id: _.uniqueId('lecture_'),
                        title,
                        type
                    },
                    chapterId
                }
            });
            yield put({
                type: 'saveCompleteStatus',
                payload: {
                    type: 'syllabus',
                    status: true
                }
            });
            if (callback) callback();
        },
        *updateLecture({ payload }, { call, put }) {
            const {
                courseId,
                chapterId,
                lectureId,
                title,
                type,
                callback
            } = payload;
            yield delay(1500);
            //call api, response return updated lecture, chapterId
            yield put({
                type: 'changeLecture',
                payload: {
                    chapterId,
                    lecture: {
                        _id: lectureId,
                        title,
                        type,
                        owner: {
                            _id: 1,
                            name: 'Tiger',
                            avatar: 'https://scontent.fsgn3-1.fna.fbcdn.net/v/t1.0-9/85144026_2793484880746288_1142991351239933952_n.jpg?_nc_cat=109&_nc_sid=85a577&_nc_oc=AQlJDP9T9y1poO8QvEkIk9Jki0k2WnVKcEU4d6tENErUiejEoAEo2s4Yk99frVwI_yA&_nc_ht=scontent.fsgn3-1.fna&oh=e6b00df474760cd111c9c2f00f7b7358&oe=5E99D0E9'
                        },
                        updatedAt: Date.now()
                    }
                }
            });
            yield put({
                type: 'changeLectureInCourseInfo',
                payload: {
                    chapterId,
                    lecture: {
                        _id: lectureId, 
                        title,
                        type
                    }
                }
            });
            if (callback) callback();
        },
        *deleteLecture({ payload }, { call, put }) {
            const { courseId, chapterId, lectureId } = payload;
            yield delay(1000);
            yield put({
                type: 'removeLecture',
                payload: {
                    chapterId,
                    lectureId
                }
            });
            yield put({
                type: 'removeLectureInCourseInfo',
                payload: {
                    chapterId,
                    lectureId
                }
            });
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
        savePrivacy(state, { payload: value }) {
            return {
                ...state,
                info: {
                    ...state.info,
                    privacy: value
                }
            };
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
        pushChapterInCourseInfo(state, { payload: chapter }) {
            return {
                ...state,
                info: {
                    ...state.info,
                    syllabus: [
                        ...state.info.syllabus,
                        chapter
                    ]
                }
            };
        },
        changeChapterInCourseInfo(state, { payload }) {
            const { _id: chapterId } = payload;
            const syllabusData = _.cloneDeep(state.info.syllabus);
            const index = _.findIndex(syllabusData, ['_id', chapterId]);
            syllabusData[index] = {
                ...syllabusData[index],
                ...payload
            };
            return {
                ...state,
                info: {
                    ...state.info,
                    syllabus: [...syllabusData]
                }
            };
        },
        removeChapterInCourseInfo(state, { payload: chapterId }) {
            return {
                ...state,
                info: {
                    ...state.info,
                    syllabus: _.filter(state.info.syllabus, chapter => chapter._id !== chapterId)
                }
            };
        },
        pushLectureInCourseInfo(state, { payload }) {
            const { chapterId, lecture } = payload;
            const syllabusData = _.cloneDeep(state.info.syllabus);
            const index = _.findIndex(syllabusData, ['_id', chapterId]);
            syllabusData[index].lectures.push(lecture);
            return {
                ...state,
                info: {
                    ...state.info,
                    syllabus: [...syllabusData]
                }
            };
        },
        changeLectureInCourseInfo(state, { payload }) {
            const { chapterId, lecture } = payload;
            const syllabusData = _.cloneDeep(state.info.syllabus);
            const index = _.findIndex(syllabusData, ['_id', chapterId]);
            const lectureIndex = _.findIndex(syllabusData[index].lectures, ['_id', lecture._id]);
            syllabusData[index].lectures[lectureIndex] = {
                ...syllabusData[index].lectures[lectureIndex],
                ...lecture
            };
            return {
                ...state,
                info: {
                    ...state.info,
                    syllabus: [...syllabusData]
                }
            };
        },
        removeLectureInCourseInfo(state, { payload }) {
            const { chapterId, lectureId } = payload;
            const syllabusData = _.cloneDeep(state.info.syllabus);
            const index = _.findIndex(syllabusData, ['_id', chapterId]);
            syllabusData[index].lectures = _.filter(syllabusData[index].lectures, lecture => lecture._id !== lectureId);
            return {
                ...state,
                info: {
                    ...state.info,
                    syllabus: [...syllabusData]
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
        updateGoals(state, { payload }) {
            const { type, data } = payload;
            return {
                ...state,
                goals: {
                    ...state.goals,
                    [type]: [...data]
                }
            };
        },
        resetGoals(state) {
            return {
                ...state,
                goals: {
                    whatLearns: null,
                    requirements: null,
                    targetStudents: null
                }
            };
        },
        saveSyllabus(state, { payload }) {
            return {
                ...state,
                syllabus: [...payload]
            };
        },
        resetSyllabus(state) {
            return {
                ...state,
                syllabus: null
            }
        },
        pushChapter(state, { payload: chapter }) {
            return {
                ...state,
                syllabus: [
                    ...state.syllabus,
                    chapter
                ]
            };
        },
        changeChapter(state, { payload }) {
            const { _id: chapterId } = payload;
            const syllabusData = _.cloneDeep(state.syllabus);
            const index = _.findIndex(syllabusData, ['_id', chapterId]);
            syllabusData[index] = {
                ...syllabusData[index],
                ...payload
            };
            return {
                ...state,
                syllabus: [...syllabusData]
            };
        },
        removeChapter(state, { payload: chapterId }) {
            return {
                ...state,
                syllabus: _.filter(state.syllabus, chapter => chapter._id !== chapterId)
            };
        },
        pushLecture(state, { payload }) {
            const { chapterId, lecture } = payload;
            const syllabusData = _.cloneDeep(state.syllabus);
            const index = _.findIndex(syllabusData, ['_id', chapterId]);
            syllabusData[index].lectures.push(lecture);
            return {
                ...state,
                syllabus: [...syllabusData]
            };
        },
        changeLecture(state, { payload }) {
            const { chapterId, lecture } = payload;
            const syllabusData = _.cloneDeep(state.syllabus);
            const index = _.findIndex(syllabusData, ['_id', chapterId]);
            const lectureIndex = _.findIndex(syllabusData[index].lectures, ['_id', lecture._id]);
            syllabusData[index].lectures[lectureIndex] = {
                ...syllabusData[index].lectures[lectureIndex],
                ...lecture
            };
            return {
                ...state,
                syllabus: [...syllabusData]
            };
        },
        removeLecture(state, { payload }) {
            const { chapterId, lectureId } = payload;
            const syllabusData = _.cloneDeep(state.syllabus);
            const index = _.findIndex(syllabusData, ['_id', chapterId]);
            syllabusData[index].lectures = _.filter(syllabusData[index].lectures, lecture => lecture._id !== lectureId);
            return {
                ...state,
                syllabus: [...syllabusData]
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