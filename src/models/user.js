import { delay } from '@/utils/utils';
import { message } from 'antd';

const USER = {
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

export default {
    namespace: 'user',
    state: null,
    effects: {
        *fetch({ payload }, { call, put }) {
            message.success('abb');
            const { callback } = payload;
            yield delay(1200);
            yield put({
                type: 'saveUser',
                payload: USER
            });
            if (callback) callback();
        }
    },
    reducers: {
        saveUser(state, { payload }) {
            return { ...payload };
        }
    }
};