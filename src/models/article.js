import { delay } from '@/utils/utils';
import _ from 'lodash';
import RESOURCES from '@/assets/fakers/resources';

export default {
    namespace: 'article',
    state: {
        info: null,
        description: null,
        resources: null
    },
    effects: {
        *fetch({ payload }, { call, put }) {
            const { courseId, lectureId } = payload;
            yield delay(1200);
            yield put({
                type: 'saveInfo',
                payload: {
                    _id: lectureId,
                    title: 'Understand What Analytics data to Collect (Tip 1)',
                    estimateHour: 1,
                    estimateMinute: 15,
                    createdAt: 1578813445900,
                    updatedAt: 1578813445900,
                    isPreviewed: false,
                    chapter: {
                        _id: 1,
                        title: 'The Vue Router'
                    },
                    owner: {
                        _id: 2,
                        name: 'Huyen Dang',
                        avatar: 'https://scontent.fvca1-1.fna.fbcdn.net/v/t1.0-9/p720x720/83990000_479642226063090_4275746647335501824_o.jpg?_nc_cat=105&_nc_sid=110474&_nc_oc=AQk-Robimtmt5cCno_-HXSTQMOo_730Rfq06rk83iajx8EQRlX3t_xW1ISBZSS-J_eI&_nc_ht=scontent.fvca1-1.fna&_nc_tp=6&oh=887eca69fa49811b0d83d788ebc46970&oe=5E991BE9'
                    },
                    content: {"blocks":[{"key":"5etj5","text":"What the fuck?","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"3lhbd","text":"How do you think about SKT","type":"unstyled","depth":0,"inlineStyleRanges":[{"offset":0,"length":26,"style":"BOLD"}],"entityRanges":[],"data":{}},{"key":"6be1l","text":"PHP is my favorite language","type":"unstyled","depth":0,"inlineStyleRanges":[{"offset":0,"length":27,"style":"BOLD"},{"offset":0,"length":27,"style":"UNDERLINE"},{"offset":0,"length":27,"style":"HIGHLIGHT"}],"entityRanges":[],"data":{}},{"key":"9c737","text":"Helloword","type":"header-two","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"1k16t","text":"List 1","type":"ordered-list-item","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"4792j","text":"list 2","type":"ordered-list-item","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"2po8i","text":"list 3","type":"ordered-list-item","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"7js3s","text":"list 1","type":"unordered-list-item","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"d4f35","text":"list 2","type":"unordered-list-item","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"6fv4n","text":"list 3","type":"unordered-list-item","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"15m6r","text":"Code block","type":"code-block","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"ds3el","text":"bloc","type":"code-block","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"k4qj","text":"import style from './index.less';","type":"code-block","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"2qinb","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"e6ooi","text":" ","type":"atomic","depth":0,"inlineStyleRanges":[],"entityRanges":[{"offset":0,"length":1,"key":0}],"data":{}},{"key":"bd1re","text":"Choc cc gi cho hoai","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[{"offset":0,"length":19,"key":1}],"data":{}},{"key":"3j70p","text":"Cho nguoi ta co hung chut di","type":"header-five","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"3rrg7","text":"NGhe ko","type":"header-two","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{"0":{"type":"IMAGE","mutability":"IMMUTABLE","data":{"src":"https://scontent-hkt1-1.xx.fbcdn.net/v/t1.0-1/89264417_1803317773143686_6489727281114644480_n.jpg?_nc_cat=102&_nc_sid=dbb9e7&_nc_oc=AQnTBgVfn97xKNImIKYeoZS9YBuwZgvh7RDRe3zhQmr9Zk5doo8UBfQygodFAdIczvw&_nc_ht=scontent-hkt1-1.xx&oh=87fce5026d63d75a7450449cca649cec&oe=5E8E5BA4","alignment":"center"}},"1":{"type":"LINK","mutability":"MUTABLE","data":{"href":"fb.com"}}}}
                }
            })
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
            const { lectureId, content, callback } = payload;
            yield delay(2000);
            yield put({
                type: 'saveContent',
                payload: content
            });
            if (callback) callback();
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