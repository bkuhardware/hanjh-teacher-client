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
                        '720p': {
                            resolution: '720p',
                            src: 'https://mp4-a.udemycdn.com/2020-02-20_09-58-28-0f53cead3f09ab469fbc2c6f4041e824/WebHD_480.mp4?1-iFVONRli1r66T14p6y4s_Qildf90vqrkE1xJluIaipxJISwYNopnX45im4FCSu1r9bFngXh2fpFh_7NO6Q-sPMAdVdbqmCKcsHfqmMA4Vh2450dl72jpHQEhzL_GCjbSF4xJ2ycUye49osiEtTQ5AWY9eoi74XsrUXJeKlj_7o'
                        },
                        '480p': {
                            resolution: '480p',
                            src: 'https://mp4-a.udemycdn.com/2018-02-26_01-07-48-8ea68d1162f9fb279ab124ea4ed195c2/WebHD_480.mp4?r3HiDOdaZ2V13Q_F6AKi1Gw6CkfIfFBVqYaIlFJ-PwOJhZG0krcpYIsbqwvba5DnQkKITlgG3mvRgyeawy-aI8H9PR77rg9EYVbiUkgUgVHXo4itSUVCTwHlBhuMZF12dxsyjK65clLdNADVxdWNZdu8xWozNKu_MWvTJDbGwLcZ'
                        },
                        '360p' : {
                            resolution: '360p',
                            src: 'https://mp4-a.udemycdn.com/2020-02-20_09-58-28-0f53cead3f09ab469fbc2c6f4041e824/WebHD_480.mp4?1-iFVONRli1r66T14p6y4s_Qildf90vqrkE1xJluIaipxJISwYNopnX45im4FCSu1r9bFngXh2fpFh_7NO6Q-sPMAdVdbqmCKcsHfqmMA4Vh2450dl72jpHQEhzL_GCjbSF4xJ2ycUye49osiEtTQ5AWY9eoi74XsrUXJeKlj_7o'
                        }
                    },
                    videoRes: '720p'
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
                    videoUrl: file,
                    resolutions: {
                        '720p': {
                            resolution: '720p',
                            src: 'https://mp4-a.udemycdn.com/2020-02-20_09-58-28-0f53cead3f09ab469fbc2c6f4041e824/WebHD_480.mp4?1-iFVONRli1r66T14p6y4s_Qildf90vqrkE1xJluIaipxJISwYNopnX45im4FCSu1r9bFngXh2fpFh_7NO6Q-sPMAdVdbqmCKcsHfqmMA4Vh2450dl72jpHQEhzL_GCjbSF4xJ2ycUye49osiEtTQ5AWY9eoi74XsrUXJeKlj_7o'
                        },
                        '480p': {
                            resolution: '480p',
                            src: 'https://mp4-a.udemycdn.com/2018-02-26_01-07-48-8ea68d1162f9fb279ab124ea4ed195c2/WebHD_480.mp4?r3HiDOdaZ2V13Q_F6AKi1Gw6CkfIfFBVqYaIlFJ-PwOJhZG0krcpYIsbqwvba5DnQkKITlgG3mvRgyeawy-aI8H9PR77rg9EYVbiUkgUgVHXo4itSUVCTwHlBhuMZF12dxsyjK65clLdNADVxdWNZdu8xWozNKu_MWvTJDbGwLcZ'
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
        saveVideo(state, { payload: videoUrl }) {
            return {
                ...state,
                info: {
                    ...state.info,
                    videoUrl
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