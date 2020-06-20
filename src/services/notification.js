/* eslint-disable */
import { apiGet, apiPut } from '@/utils/request';

export async function fetch(skip = 0, limit = 7) {
    return apiGet(`${TEACHER_API_URL}/notifications?skip=${skip}&limit=${limit}`);
}

export async function seen(notificationId) {
    return apiPut(`${TEACHER_API_URL}/notifications/${notificationId}/seen`);
}

export async function allSeen() {
    return apiPut(`${TEACHER_API_URL}/notifications/all-seen`);
}