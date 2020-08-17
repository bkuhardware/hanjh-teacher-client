import { delay } from '@/utils/utils';
import _ from 'lodash';
import RESOURCES from '@/assets/fakers/resources';
import testVtt from '@/assets/fakers/test.vtt';
import testVttvn from '@/assets/fakers/testvn.vtt';
import * as courseServices from '@/services/course';
import * as cloudServices from '@/services/cloud';

export default {
    namespace: 'video',
    state: {
        info: null,
        description: null,
        resources: null
    },
    effects: {
        *fetchVideoLecture({ payload }, { call, put }) {
            const { courseId, chapterId, lectureId } = payload;
            const response = yield call(courseServices.fetchVideoLecture, courseId, chapterId, lectureId);
            if (response) {
                const result = response.data;
                result.resolutions = _.keyBy(result.resolutions, 'resolution');
                const videoRes = _.max(_.map(_.keys(result.resolutions), key => parseInt(key)));
                result.videoRes = videoRes;
                yield put({
                    type: 'saveInfo',
                    payload: result
                });
            }
        },
        *upload({ payload }, { call, put }) {
            // const {
            //     lectureId,
            //     chapterId,
            //     courseId,
            //     name,
            //     formData,
            //     saveProgress,
            //     callback
            // } = payload;
            //
            // saveProgress(38);
            // yield delay(2500);
            // //call cloud api to upload video, return url, this cloud api is different, only for video.
            // saveProgress(66);
            // //call api to update videoUrl for lecture.
            // yield delay(2200);
            // saveProgress(89);
            // yield put({
            //     type: 'saveVideo',
            //     payload: {
            //         videoRes: '1024p',
            //         resolutions: {
            //             1024: {
            //                 resolution: 1024,
            //                 src: file
            //             },
            //             720: {
            //                 resolution: 720,
            //                 src: 'http://media.w3.org/2010/05/bunny/movie.mp4'
            //             },
            //             480: {
            //                 resolution: 480,
            //                 src: 'http://www.peach.themazzone.com/durian/movies/sintel-1024-surround.mp4'
            //             }
            //         }
            //     }
            //     //resolution nữa.
            // });
            // saveProgress(100);
            // yield delay(1000); //delay for UI
            // if (callback) callback();
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
                courseId,
                chapterId,
                lectureId,
                lang,
                label,
                formData,
                callback
            } = payload;
            let response = yield call(cloudServices.uploadCourseLectureVideoVtt, courseId, lectureId, formData);
            if (response) {
                const url = response.data.url;
                response = yield call(courseServices.updateVideoLectureVtt, courseId, chapterId, lectureId, {
                    lang, url, label
                });
                if (response) {
                    const newVttData = response.data;
                    yield put({
                        type: 'pushCaption',
                        payload: newVttData
                    });
                    if (callback) {
                        callback();
                    }
                }
            }
        },
        *deleteCaption({ payload }, { call, put }) {
            const { captionId, lectureId, courseId, chapterId, callback } = payload;
            const response = yield call(courseServices.deleteCaptionVideoLecture, courseId, chapterId, lectureId, captionId);
            if (response) {
                yield put({
                    type: 'removeCaption',
                    payload: captionId
                });
                if (callback) callback();
            }
        },
        *preview({ payload }, { call, put }) {
            const { lectureId, value, callback } = payload;
            yield delay(1000);
            yield put({
                type: 'savePreview',
                payload: value
            });
            if (callback) callback();
        },
        *downloadable({ payload }, { call, put }) {
            const { lectureId, value, callback } = payload;
            yield delay(1200);
            yield put({
                type: 'saveDownload',
                payload: value
            });
            if (callback) callback();
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
            let uploadStatus;
            if (_.isEmpty(payload.resolutions) || !payload.videoRes) {
                uploadStatus = 'NOT_YET';
            }
            else {
                uploadStatus = 'OK';
            }
            return {
                ...state,
                info: { ...payload, uploadStatus }
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
        savePreview(state, { payload: value }) {
            return {
                ...state,
                info: {
                    ...state.info,
                    isPreviewed: value
                }
            }
        },
        saveDownload(state, { payload: value }) {
            return {
                ...state,
                info: {
                    ...state.info,
                    isDownloadable: value
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
        updateVideoUploadStatus(state, { payload: value }) {
            return {
                ...state,
                info: {
                    ...state.info,
                    uploadStatus: value
                }
            };
        },
        saveResolutionsAfterUpload(state, { payload }) {
            const { resolutions, videoRes } = payload;
            return {
                ...state,
                info: {
                    ...state.info,
                    resolutions,
                    videoRes
                }
            };
        },
        resetLecture() {
            console.log('gdafdfafd');
            return {
                info: null,
                description: null,
                resources: null
            };
        }
    }
};