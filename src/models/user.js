import { delay } from '@/utils/utils';
import _ from 'lodash';
import storage from '@/utils/storage';
import router from 'umi/router';
import * as userService from '@/services/user';

export default {
    namespace: 'user',
    state: null,
    effects: {
        *fetch({ payload }, { call, put }) {
            const { callback } = payload;
            const response = yield call(userService.fetch);
            if (response) {
                yield put({
                    type: 'save',
                    payload: response.data
                });
                if (callback) callback();
            }
        },
        *changeAvatar({ payload }, { call, put }) {
            const { file, callback } = payload;
            yield delay(1200);
            const avatarUrl = 'https://images.pexels.com/photos/4321944/pexels-photo-4321944.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260';
            const response = yield call(userService.updateAvatar, avatarUrl);
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
            const response = yield call(userService.updateSocials, data);
            if (response) {
                yield put({
                    type: 'update',
                    payload: response.data
                });
                if (callback) callback();
            }
        },
        *changePassword({ payload }, { call, put }) {
            const {
                oldPassword,
                newPassword,
                onOk,
                onIncorrect
            } = payload;
            const response = yield call(userService.changePassword, oldPassword, newPassword);
            if (response) {
                const errorCode = 1 * response.errorCode;
                if (errorCode === 1)
                    onIncorrect();
                else onOk();
            }
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
        saveNoUsNotification(state, { payload: value }) {
            return {
                ...state,
                noOfUsNotification: value
            };
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