import { delay } from '@/utils/utils';
import _ from 'lodash';
import RESOURCES from '@/assets/fakers/resources';

export default {
    namespace: 'video',
    state: {
        info: null,
        description: null,
        resources: null
    },
    effects: {
        *fetch({ payload }, { call, put }) {
            const { courseId, lectureId } = payload;
            yield delay(2000);
            yield put({
                type: 'saveInfo',
                payload: {
                    _id: lectureId,
                    title: 'The Vue instance',
                    createdAt: 1578813445900,
                    updatedAt: 1578813445900,
                    chapter: {
                        _id: 1,
                        title: 'ES6 Javscript'
                    },
                    owner: {
                        _id: 2,
                        name: 'Trong Luan',
                        avatar: null
                    },
                    captions: [],
                    videoUrl: 'https://mp4-a.udemycdn.com/2018-05-11_11-14-45-8469d1761758f153fa31634801ff8d12/WebHD_480.mp4?twz0SkkrJGJ_2GCaurAgDvs5YrofDB1vEoKGOcGXCJMqRXQ3KakZuYmuLYV5DPUIa5x_X5VdF40s2VjdIZ2frLCfIT_phBP1yFviySPPeVwPXhcyc_82_DuL2KBrja3sShPNmbEEbHgVIrSk1YmbJ88CWRnTmkzTkdhkKvOxLnS9'
                }
            });
        },
        *upload({ payload }, { call, put }) {
            const {
                lectureId,
                name,
                file,
                saveProgress,
                callback
            } = payload;
            saveProgress(38);
            yield delay(2500);
            //call cloud api to upload video, return url, this cloud api is different, only for video.
            saveProgress(66);
            //call api to update videoUrl for lecture.
            yield delay(2200);
            saveProgress(89);
            yield put({
                type: 'saveVideo',
                payload: file
            });
            saveProgress(100);
            yield delay(1000); //delay for UI
            if (callback) callback();    
        },
        *delete({ payload: lectureId }, { call, put }) {
            //call api to delete
            yield delay(1200);
            yield put({
                type: 'saveVideo',
                payload: null
            });
        },
        *fetchDescription({ payload }, { call, put }) {
            const { courseId, lectureId } = payload;
            yield delay(1000);
            yield put({
                type: 'saveDescription',
                payload: '<div>con c</div>'
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
        *updateDescription({ payload }, { call, put }) {
            const { lectureId, content } = payload;
            yield delay(1600);
            yield put({
                type: 'saveDescription',
                payload: content
            });
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
        saveVideo(state, { payload: videoUrl }) {
            return {
                ...state,
                info: {
                    ...state.info,
                    videoUrl
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
        reset(state) {
            return {
                info: null,
                description: null,
                resources: null
            };
        }
    }
};