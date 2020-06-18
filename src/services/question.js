/* eslint-disable */
import { apiGet, apiPost } from '@/utils/request';
import { join } from 'lodash';

export async function fetch(courseId, params, page = 1, limit = 12) {
    const {
        sort,
        lecture,
        questionTypes
    } = params;
    const questionTypesStr = join(questionTypes, ',');
    const queryStr = `page=${page}&limit=${limit}&courseId=${courseId}&sort=${sort}&lecture=${lecture}&questionTypes=${questionTypesStr}`;
    return apiGet(`${QUESTION_API_URL}?${queryStr}`);
}