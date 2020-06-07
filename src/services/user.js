/* eslint-disable  */
import { apiPost, apiPut } from '@/utils/request';

export async function signIn(params) {
    return apiPost(`${AUTH_API_URL}/login/teacher`, {
        body: params
    });
}

export async function updateAvatar(params) {
    return apiPut(`${TEACHER_API_URL}/update/avatar`, {
        body: params
    });
}

export async function update(params) {
    return apiPut(`${TEACHER_API_URL}/update`, {
        body: params
    })
}