import { delay } from '@/utils/utils';
import _ from 'lodash';
import RESOURCES from '@/assets/fakers/resources';
import * as courseServices from '@/services/course';

export default {
    namespace: 'article',
    state: {
        info: null,
        description: null,
        resources: null
    },
    effects: {
        *fetch({ payload }, { call, put }) {
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
            const { courseId, lectureId } = payload;
            yield delay(1000);
            yield put({
                type: 'saveDescription',
                payload: 'Hello'
            });
        },
        *fetchResources({ payload }, { call, put }) {
            const { courseId, lectureId } = payload;
            yield delay(1200);
            yield put({
                type: 'saveResources',
                payload: RESOURCES
            })
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
            const { hour, minute, callback } = payload;
            yield delay(1200);
            yield put({
                type: 'saveEstimateTime',
                payload: {
                    hour,
                    minute
                }
            });
            if (callback) callback();
        },
        *updateDescription({ payload }, { call, put }) {
            const { lectureId, content } = payload;
            yield delay(1600);
            yield put({
                type: 'saveDescription',
                payload: content
            });
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
                lectureId,
                name,
                mimeType,
                file,
                callback,
                extra
            } = payload;
            yield delay(1000);
            //call cloud api to upload file.
            //api cloud return file url,
            yield delay(1500);
            //call api to add resource to lecture with correspond lectureId, params is url, name, extra, type = 'downloadable'.
            //server return new object.
            //front end push to downloadable list.
            yield put({
                type: 'pushDownloadable',
                payload: {
                    _id: _.uniqueId('resource_new_'),
                    name: name,
                    extra: extra,
                    url: 'https://fb.com'
                }
            });
            if (callback) callback();
        },
        *addExternal({ payload }, { call, put }) {
            const { lectureId, callback, name, url } = payload;
            yield delay(1200);
            //call api with id, name, url, extra default = null, type = 'external'
            yield put({
                type: 'pushExternal',
                payload: {
                    _id: _.uniqueId('resource_external_'),
                    name: name,
                    extra: null,
                    url: url
                }
            });
            if (callback) callback();
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