import { delay } from '@/utils/utils';
import _ from 'lodash';
import RESOURCES from '@/assets/fakers/resources';
import testVtt from '@/assets/fakers/test.vtt';
import testVttvn from '@/assets/fakers/testvn.vtt';

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
                    isPreviewed: false,
                    isDownloadable: false,
                    chapter: {
                        _id: 1,
                        title: 'ES6 Javscript'
                    },
                    owner: {
                        _id: 2,
                        name: 'Trong Luan',
                        avatar: null
                    },
                    captions: [
                        // {
                        //     _id: 'caption_1',
                        //     srcLang: 'en',
                        //     label: 'English',
                        //     src: testVtt
                        // },
                        // {
                        //     _id: 'caption_3',
                        //     srcLang: 'vi',
                        //     label: 'Vietnamese',
                        //     src: testVttvn
                        // }
                    ],
                    resolutions: {
                        720: {
                            resolution: 720,
                            src: 'https://mp4-a.udemycdn.com/2020-02-20_09-58-28-0f53cead3f09ab469fbc2c6f4041e824/WebHD_720p.mp4?f7LJEukMlLXv6ikJ3slEFcPaZ9tt44haoWFlQnl-ZaVVmjiPSt8hSy7eUgkHg9d35X4i18yO3K0hMybfMuenUDLzpNqNolG2mcLqGLS9oCqkSoM0TrvzmaQaAXzGs9wMOX1iP8Rq-CpFOoWAJujNyO6YCo1sc0ZE5WhHbc8cc4I9oA'
                        },
                        480: {
                            resolution: 480,
                            src: 'https://mp4-a.udemycdn.com/2019-05-29_10-45-02-5709a84e9579bf6d1a24c9a5de9a8978/WebHD_720p.mp4?TUNw0RPn6eZYXxxxm_FISAqlnATZ_LsEYKb6aBbUi4L76qLzuk8TaJMqyc0ieTZqVKp6BlW1vCP5ZX0mfkt6P4qObVqucDvgoEhH1z9qvEjNG7bewP0hl5Nz_gQlMcHJc1nVYtr4P4MCuZcxtoRplKU9zKID6COxZcTVIo0g0oFynw'
                        },
                        360 : {
                            resolution: 360,
                            src: 'https://mp4-a.udemycdn.com/2020-02-20_09-58-28-0f53cead3f09ab469fbc2c6f4041e824/WebHD_720p.mp4?f7LJEukMlLXv6ikJ3slEFcPaZ9tt44haoWFlQnl-ZaVVmjiPSt8hSy7eUgkHg9d35X4i18yO3K0hMybfMuenUDLzpNqNolG2mcLqGLS9oCqkSoM0TrvzmaQaAXzGs9wMOX1iP8Rq-CpFOoWAJujNyO6YCo1sc0ZE5WhHbc8cc4I9oA'
                        }
                    },
                    videoRes: 720
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
                payload: {
                    videoRes: '1024p',
                    resolutions: {
                        1024: {
                            resolution: 1024,
                            src: file
                        },
                        720: {
                            resolution: 720,
                            src: 'https://mp4-a.udemycdn.com/2020-02-20_09-58-28-0f53cead3f09ab469fbc2c6f4041e824/WebHD_720p.mp4?f7LJEukMlLXv6ikJ3slEFcPaZ9tt44haoWFlQnl-ZaVVmjiPSt8hSy7eUgkHg9d35X4i18yO3K0hMybfMuenUDLzpNqNolG2mcLqGLS9oCqkSoM0TrvzmaQaAXzGs9wMOX1iP8Rq-CpFOoWAJujNyO6YCo1sc0ZE5WhHbc8cc4I9oA'
                        },
                        480: {
                            resolution: 480,
                            src: 'https://mp4-a.udemycdn.com/2019-05-29_10-45-02-5709a84e9579bf6d1a24c9a5de9a8978/WebHD_720p.mp4?TUNw0RPn6eZYXxxxm_FISAqlnATZ_LsEYKb6aBbUi4L76qLzuk8TaJMqyc0ieTZqVKp6BlW1vCP5ZX0mfkt6P4qObVqucDvgoEhH1z9qvEjNG7bewP0hl5Nz_gQlMcHJc1nVYtr4P4MCuZcxtoRplKU9zKID6COxZcTVIo0g0oFynw'
                        }
                    }
                }
                //resolution nữa.
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
        *addCaption({ payload }, { call, put }) {
            const {
                lectureId,
                lang,
                name,
                file,
                callback
            } = payload;
            //call cloud api for upload vtt file
            yield delay(1340);
            //call api for add caption to lecture use lectureId, url, lang.
            yield delay(1100);
            //then get return value is new caption object
            yield put({
                type: 'pushCaption',
                payload: {
                    _id: _.uniqueId('caption_'),
                    srcLang: lang.key,
                    label: lang.label,
                    src: testVtt
                }
            });
            if (callback) callback();
        },
        *deleteCaption({ payload }, { call, put }) {
            const { captionId, lectureId, callback } = payload;
            yield delay(1500);
            yield put({
                type: 'removeCaption',
                payload: captionId
            });
            if (callback) callback();
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
        saveVideo(state, { payload }) {
            return {
                ...state,
                info: {
                    ...state.info,
                    ...payload
                }
            };
        },
        pushCaption(state, { payload }) {
            return {
                ...state,
                info: {
                    ...state.info,
                    captions: [
                        ...state.info.captions,
                        { ...payload }
                    ]
                }
            };
        },
        removeCaption(state, { payload: captionId }) {
            return {
                ...state,
                info: {
                    ...state.info,
                    captions: _.filter(state.info.captions, caption => caption._id !== captionId)
                }
            }
        },
        saveResolution(state, { payload: resolution }) {
            return {
                ...state,
                info: {
                    ...state.info,
                    videoRes: resolution
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