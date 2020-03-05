import { delay } from '@/utils/utils';
import { message } from 'antd';
import storage from '@/utils/storage';
import router from 'umi/router';

const USER = {
    _id: 1,
    token: 'foo-token',
    name: 'Thuy Huyen',
    avatar: "https://scontent.fsgn5-1.fna.fbcdn.net/v/t1.0-9/70005438_1611468775661921_503861777637834752_o.jpg?_nc_cat=101&_nc_sid=13bebb&_nc_oc=AQktln7NCl0pBtLXwz9EFKx-2k2mYglGrFh2JLK6NcHjMq9z011rrU9SROHlNTMVyWg&_nc_ht=scontent.fsgn5-1.fna&oh=30cbb1d86a1102457c64a64a1f354026&oe=5E802CD0",
    job: 'Frontend developer at Google Inc. Passionate with Javasript, React, Angular and Vue.',
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
            yield delay(2400);
            yield put({
                type: 'update',
                payload: {
                    avatar: file
                }
            });
            if (callback) callback();
        },
        *changeInfo({ payload }, { call, put }) {
            const { info, callback } = payload;
            yield delay(2500);
            yield put({
                type: 'update',
                payload: {
                    ...info
                }
            });
            if (callback) callback();
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
            const { phone, password } = payload;
            yield delay(1600);
            if (response) {
                const { data: user } = response;
                const token = user.token;
                storage.setToken(token);
                yield put({
                    type: 'save',
                    payload: user
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