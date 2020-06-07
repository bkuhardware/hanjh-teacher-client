import { delay } from '@/utils/utils';
import _ from 'lodash';
import storage from '@/utils/storage';
import router from 'umi/router';
import * as userService from '@/services/user';

const USER = {
    _id: 'user_1',
    token: 'foo-token',
    name: 'Thuy Huyen',
    avatar: "https://scontent.fsgn5-1.fna.fbcdn.net/v/t1.0-9/70005438_1611468775661921_503861777637834752_o.jpg?_nc_cat=101&_nc_sid=13bebb&_nc_oc=AQktln7NCl0pBtLXwz9EFKx-2k2mYglGrFh2JLK6NcHjMq9z011rrU9SROHlNTMVyWg&_nc_ht=scontent.fsgn5-1.fna&oh=30cbb1d86a1102457c64a64a1f354026&oe=5E802CD0",
    headline: 'Frontend developer at Google Inc. Passionate with Javasript, React, Angular and Vue.',
    biography: '<div><div>Frontend developer at Google Inc. Passionate with Javasript, React, Angular and Vue.</div><div>Frontend developer at Google Inc. Passionate with Javasript, React, Angular and Vue.</div></div>',
    email: 'luannguyentrong98@gmail.com',
    noOfUsNotification: 22,
    twitter: '',
    facebook: 'bkuhardware',
    youtube: '',
    instagram: ''
};

const response = {
    data: USER
}

export default {
    namespace: 'user',
    state: null,
    effects: {
        *fetch({ payload }, { call, put }) {
            const { callback } = payload;
            yield delay(1200);
            yield put({
                type: 'save',
                payload: USER
            });
            if (callback) callback();
        },
        *changeAvatar({ payload }, { call, put }) {
            const { file, callback } = payload;
            yield delay(1200);
            const avatarUrl = 'https://images.pexels.com/photos/4321944/pexels-photo-4321944.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260';
            const response = yield call(userService.updateAvatar, {
                avatar: avatarUrl
            });
            if (response) {
                yield put({
                    type: 'update',
                    payload: response.data
                });
                if (callback) callback();
            }
        },
        *changeInfo({ payload }, { call, put }) {
            const { info, callback } = payload;
            const response = yield call(userService.update, info);
            if (response) {
                yield put({
                    type: 'update',
                    payload: response.data
                });
                if (callback) callback();
            }
        },
        *changeSocial({ payload }, { call, put }) {
            const { data, callback } = payload;
            yield delay(1200);
            yield put({
                type: 'update',
                payload: {
                    ...data
                }
            });
            if (callback) callback();
        },
        *changePassword({ payload }, { call, put }) {
            const {
                oldPassword,
                newPassword,
                onOk,
                onIncorrect
            } = payload;
            yield delay(2000);
            const status = 0;
            if (status === 0) onOk();
            else onIncorrect();
        },
        *login({ from, payload }, { call, put }) {
            const response = yield call(userService.signIn, payload);
            if (response) {
                const { data: user } = response;
                const token = user.token;
                storage.setToken(token);
                yield put({
                    type: 'save',
                    payload: _.omit(user, ['token'])
                });
                //set FCM token
                router.replace(from);
            }
        },
        *logout(action, { put }) {
            storage.setToken(null);
            router.push('/user/login');
            yield put({ type: 'reset' });
        }
    },
    reducers: {
        save(state, { payload }) {
            return { ...payload };
        },
        update(state, { payload }) {
            return {
                ...state,
                ...payload
            };
        },
        reset() {
            return null;
        }
    }
};