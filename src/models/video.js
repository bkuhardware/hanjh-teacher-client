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
                    videoUrl: null
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
            //call cloud api to upload video, return url,
            saveProgress(66);
            //call api to update videoUrl for lecture.
            yield delay(2200);
            saveProgress(89);
            yield put({
                type: 'saveVideo',
                payload: null
            });
            saveProgress(100);
            yield delay(1000); //delay for UI
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
        reset(state) {
            return {
                info: null,
                description: null,
                resources: null
            };
        }
    }
};