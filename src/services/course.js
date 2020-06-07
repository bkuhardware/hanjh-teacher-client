/* eslint-disable  */
import { apiGet, apiPost } from '@/utils/request';

export async function fetch(sort, page = 1, limit = 8) {
    return apiGet(`${COURSE_API_URL}/my/teacher?page=${page}&limit=${limit}&sort=${sort}`);
}

export async function create(title, area) {
    return apiPost(`${COURSE_API_URL}`, {
        body: {
            title,
            area
        }
    });
}

export async function fetchInfo(courseId) {
    return apiGet(`${COURSE_API_URL}/${courseId}/info`);
}