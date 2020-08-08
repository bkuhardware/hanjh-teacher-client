import { delay } from '@/utils/utils';
import _ from 'lodash';
import RESOURCES from '@/assets/fakers/resources';
import * as courseServices from '@/services/course';
import * as cloudServices from '@/services/cloud';

export default {
    namespace: 'article',
    state: {
        info: null,
        description: null,
        resources: null
    },
    effects: {
        *fetch({ payload }, { call, put, select }) {
            const { courseId, chapterId, lectureId } = payload;
            const response = yield call(courseServices.fetchArticleLecture, courseId, chapterId, lectureId);
            if (response) {
                yield put({
                    type: 'saveInfo',
                    payload: response.data
                });
            }
        },
        *fetchDescription({ payload }, { call, put }) {
            const { courseId, lectureId, chapterId } = payload;
            const response = yield call(courseServices.fetchLectureDescription, courseId, chapterId, lectureId);
            if (response) {
                yield put({
                    type: 'saveDescription',
                    payload: response.data
                });
            }
        },
        *fetchResources({ payload }, { call, put }) {
            const { courseId, chapterId, lectureId } = payload;
            const response = yield call(courseServices.fetchLectureResources, courseId, chapterId, lectureId);
            if (response) {
                yield put({
                    type: 'saveResources',
                    payload: response.data
                })
            }
        },
        *preview({ payload }, { call, put }) {
            const { courseId, chapterId, lectureId, value, callback } = payload;
            const response = yield call(courseServices.setArticleLecturePreview, courseId, chapterId, lectureId, value);
            if (response) {
                yield put({
                    type: 'savePreview',
                    payload: value
                });
                if (callback) callback();
            }
        },
        *updateEstimateTime({ payload }, { call, put }) {
            const { courseId, lectureId, chapterId, hour, minute, callback } = payload;
            const response = yield call(courseServices.updateArticleLectureEstimateTime, courseId, chapterId, lectureId, hour, minute);
            if (response) {
                yield put({
                    type: 'saveEstimateTime',
                    payload: {
                        hour,
                        minute
                    }
                });
                if (callback) callback();
            }
        },
        *updateDescription({ payload }, { call, put }) {
            const { courseId, chapterId, lectureId, content } = payload;
            const response = yield call(courseServices.updateDescription, courseId, chapterId, lectureId, content);
            if (response) {
                yield put({
                    type: 'saveDescription',
                    payload: content
                });
            }
        },
        *updateContent({ payload }, { call, put }) {
            const { courseId, chapterId, lectureId, content, callback } = payload;
            const response = yield call(courseServices.updateArticleLectureContent, courseId, chapterId, lectureId, content);
            if (response) {
                yield put({
                    type: 'saveContent',
                    payload: content
                });
                if (callback) callback();
            }
        },
        *addDownloadable({ payload }, { call, put }) {
            const {
                courseId,
                chapterId,
                lectureId,
                name,
                formData,
                callback,
                extra
            } = payload;
            let response;
            response = yield call(cloudServices.uploadCourseLectureResource, courseId, lectureId, formData);
            if (response) {
                const resourceUrl = response.data.url;
                response = yield call(courseServices.addResource, courseId, chapterId, lectureId, {
                    name,
                    extra,
                    url: resourceUrl,
                    type: 'downloadable'
                });
                if (response) {
                    yield put({
                        type: 'pushDownloadable',
                        payload: response.data
                    });
                    if (callback) callback();
                }
            }
        },
        *addExternal({ payload }, { call, put }) {
            const { courseId, chapterId, lectureId, callback, name, url } = payload;
            const response = yield call(courseServices.addResource, courseId, chapterId, lectureId, {
                name,
                url,
                extra: '',
                type: 'external'
            });
            if (response) {
                yield put({
                    type: 'pushExternal',
                    payload: response.data
                });
                if (callback) callback();
            }
        },
        *deleteResource({ payload }, { call, put }) {
            const { resourceId, type } = payload;
            //call api with resourceId, if success moi dung type. response return only status
            yield delay(1500); 
            yield put({
                type: 'removeResource',
                payload: {
                    resourceId,
                    type
                }
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
        savePreview(state, { payload: value }) {
            return {
                ...state,
                info: {
                    ...state.info,
                    isPreviewed: value
                }
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
        saveContent(state, { payload }) {
            return {
                ...state,
                info: {
                    ...state.info,
                    content: payload
                }
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
        pushDownloadable(state, { payload }) {
            return {
                ...state,
                resources: {
                    ...state.resources,
                    downloadable: [
                        ...state.resources.downloadable,
                        { ...payload }
                    ]
                }
            };
        },
        pushExternal(state, { payload }) {
            return {
                ...state,
                resources: {
                    ...state.resources,
                    external: [
                        ...state.resources.external,
                        { ...payload }
                    ]
                }
            };
        },
        removeResource(state, { payload }) {
            const { resourceId, type } = payload;
            return {
                ...state,
                resources: {
                    ...state.resources,
                    [type]: _.filter(state.resources[type], resource => resource._id !== resourceId)
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