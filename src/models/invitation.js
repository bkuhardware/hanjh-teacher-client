import { delay } from '@/utils/utils';
import * as teacherServices from '@/services/user';

export default {
  namespace: 'invitation',
  state: null,
  effects: {
    *fetchInvitation({ payload: notificationId }, { call, put }) {
      const response = yield call(teacherServices.fetchInvitation, notificationId);
      if (response) {
        yield put({
          type: 'saveInvitation',
          payload: response.data
        })
      }
    },
    *acceptInvitation({ payload }, { call, put }) {
      const { courseId, notificationId, callback } = payload;
      const response = yield call(teacherServices.acceptInvitation, notificationId);
      if (response) {
        if (callback) callback(courseId);
      }
    }
  },
  reducers: {
    saveInvitation(state, { payload }) {
      return { ...payload };
    },
    clearState() {
      return null;
    }
  }
}
