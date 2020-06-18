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
};

export async function fetchThread(courseId, questionId) {
    return apiGet(`${QUESTION_API_URL}/courses/${courseId}/${questionId}`);
}

export async function fetchAnswers(courseId, questionId, skip = 0, limit = 5) {
    return apiGet(`${QUESTION_API_URL}/courses/${courseId}/${questionId}/answers?skip=${skip}&limit=${limit}`);
}