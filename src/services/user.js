/* eslint-disable  */
import { apiPost, apiPut, apiGet } from '@/utils/request';

export async function signIn(params) {
    return apiPost(`${AUTH_API_URL}/login/teacher`, {
        body: params
    });
}

export async function updateAvatar(avatarUrl) {
    return apiPut(`${TEACHER_API_URL}/update/avatar`, {
        body: {
            avatar: avatarUrl
        }
    });
}

export async function update(params) {
    return apiPut(`${TEACHER_API_URL}/update`, {
        body: params
    });
}

export async function fetch() {
    return apiGet(`${TEACHER_API_URL}/me`);
}

export async function updateSocials(params) {
    return apiPut(`${TEACHER_API_URL}/update/socials`, {
        body: params
    });
}

export async function changePassword(oldPassword, newPassword) {
    return apiPut(`${TEACHER_API_URL}/update/password`, {
        body: {
            oldPassword,
            newPassword
        }
    });
}