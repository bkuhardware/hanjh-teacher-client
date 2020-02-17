import { delay } from '@/utils/utils';
import { message } from 'antd';
import storage from '@/utils/storage';
import router from 'umi/router';

const USER = {
    token: 'foo-token',
    name: 'Ngoc Hanh Vuong',
    avatar: "https://scontent.fdad1-1.fna.fbcdn.net/v/t1.0-9/32693290_1729250587169728_2501159919764373504_o.jpg?_nc_cat=104&_nc_oc=AQmLZedMfuo9uONVez_pontQ0TqMhBv3Z-Mp-6Hq6GgjFReu5-W0sSfdgN5dxtz2IHk&_nc_ht=scontent.fdad1-1.fna&oh=c8604c3b1dbfac1191570dc7774bc025&oe=5EC92867",
    job: '',
    biography: '',
    email: 'ngochanhvuong@gmail.com',
    noOfUsNotification: 22,
    twitter: '',
    facebook: '',
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
            message.success('abb');
            const { callback } = payload;
            yield delay(1200);
            yield put({
                type: 'save',
                payload: USER
            });
            if (callback) callback();
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
        reset() {
            return null;
        }
    }
};