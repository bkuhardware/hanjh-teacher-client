import { delay } from '@/utils/utils';

export default {
    namespace: 'course',
    state: {},
    effects: {
        *validate({ payload }, { call, put }) {
            const {
                courseId,
                onOk,
                onInvalidCourse,
                onInvalidStudent
            } = payload;
            yield delay(1400);
            const validStatus = 0;
            if (validStatus === 0) onOk();
            else if (validStatus === 1) onInvalidCourse();
            else onInvalidStudent();
        }
    }
}